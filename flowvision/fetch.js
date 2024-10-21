import { readings } from './getreading.js';
import { flow } from './getflow.js';
import schedule from 'node-schedule';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { devices } from './pulse_reader.js'

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});


async function getFlow() {
    try {
        const volume = await readings(); // Fetch volume data
        //console.log(volume.length);
        
        let array = [];
        for (let i = 0; i < volume.length; i++) {
            if (volume[i].Brand == 'AW' || volume[i].Brand == 'AG' || volume[i].Brand == 'JMW' || volume[i].Brand == 'NKE'){
            const device = `${volume[i].Brand}-${volume[i].Device}`;
            const date = new Date();
            date.setDate(date.getDate() - 1); // Get date 1 day ago
            const start = new Date(date).toISOString();
            const end = new Date().toISOString();
            
            // Fetch flow data for each device
            const caudal = await flow(device, start, end);

            for (let j = 0; j < caudal.length; j++) {
                array.push({
                    "Date": caudal[j][0],  
                    "Device": volume[i].Device,
                    "Flow": caudal[j][1]   
                });
            }
        }
        }
        //console.log(array.length); 
        return array;
    } catch (error) {
        console.error('Error in getFlow:', error);
    }
};

// Define an async function to insert flow
const insFlow = async (data) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      const data_tr = new Date();
      const year = data_tr.getFullYear();
      const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
      const day = String(data_tr.getDate()).padStart(2, '0');
      const hour = String(data_tr.getHours()).padStart(2, '0');
      const min = String(data_tr.getMinutes()).padStart(2, '0');
      var formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
      // Iterate over the data and execute insert queries
      for (let i=0; i < data.length ; i++){
          await client.query(`INSERT INTO flow2(device, date, flow)  VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`, 
            [Number(data[i].Device), new Date(data[i].Date), Number(data[i].Flow)]);
      }
      // Commit the transaction
      await client.query('COMMIT');
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
        console.log(`${formattedDate} => ${data.length} => flows inserted successfully!`);
      // Release the client back to the pool
      client.release();
    }
  };

async function flowVision() {
    try {
      const getflow = await getFlow();
      // Map devices for quick lookup
      const deviceMap = new Map(devices.map(device => [device.sn, device.meter]));

      // Replace serial numbers with meter names
      getflow.forEach(record => {
        if (deviceMap.has(record.Device)) {
          record.Device = deviceMap.get(record.Device);
        }
      });
      await insFlow(getflow);
    } catch (error) {
      console.error('Error in flowvision:', error);
    }
  }
    

/*
//schedule rules
const rule = new schedule.RecurrenceRule();
rule.second = 0; //(0-59, OPTIONAL)
rule.minute = 0; //(0-59)
rule.hour = 0; //(0-23)
rule.date = 1; //(1-31)
rule.month = 1; //(1-12)
rule.dayOfWeek = 0; //(0 - 7) (0 or 7 is Sun)
rule.tz = 'Europe/Lisbon';
*/


const rule = new schedule.RecurrenceRule();
rule.minute = 5; //(0-59)
rule.hour = 8; //(0-23)
// Schedule the tasks
const job = schedule.scheduleJob(rule, flowVision);



const rule2 = new schedule.RecurrenceRule();
rule2.minute = 5; //(0-59)
rule2.hour = 20; //(0-23)
// Schedule the tasks
const job2 = schedule.scheduleJob(rule2, flowVision);
