import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import axios from 'axios';
import { devices } from './pulse_reader.js'

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword2,
    database: process.env.psqlGiggoDatabase
});

async function makeRequest() {
    try {
      const response = await axios.get('https://flowision.pt/api/mainDashboard/getXlsData?dom=cli006&fields=0%20as%20prop%20,%20seq%20,%20time%20,%20dma,in_out,motedesc%20,%20moteidsn,moteid%20,%20idconsumidor%20,%20%27/consumer/wadwad/%27%7C%7Cidconsumidor%7C%7C%27/%27%7C%7Cdom%20as%20idconsumidor_routerlink%20%20,%20readtext%20,%20statcons1d,statcons1w,statcons1m%20,%20timeago,%20timeagointerval%20,%20event_pt');
      return response.data.message.rows;
    } catch (error) {
      console.error('Error in makeRequest:', error);
    }
  }
  
async function cleanData(msg) {
  try {
    let data = [...msg]; // Make a copy of msg to avoid mutating original
    let array = [];
    for (let i = 0; i < data.length; i++) {
      const moteidsn = data[i].moteidsn || '';
      const readtext = data[i].readtext || '';
      let device = '';
      let brand = '';
      if (moteidsn.includes('/')) {
        device = moteidsn.substring(moteidsn.indexOf('/') + 1).trim();
        brand = moteidsn.substring(0, moteidsn.indexOf('/')).trim();
      }
      const volumeStr = readtext.substring(0, readtext.indexOf(' m')).trim().replace(",", ".");
      const volume = parseFloat(volumeStr) || 0;  // Handle NaN case
      const alarm = data[i].event_pt || 'no alarms';

      // Verifica se todos os valores são válidos antes de adicionar ao array
      if (data[i].time && device && brand && !isNaN(volume)) {
        array.push({
          "Date": data[i].time,
          "Device": device,
          "Brand": brand,
          "Volume": volume,
          "Alarm" : alarm
        });
      }
    }
    return array;
  } catch (error) {
    console.error('Error in cleanData:', error);
  }
}

// Define an async function to insert readings
const insReadings = async (data) => {
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
      if (data[i].Brand == 'AW' || data[i].Brand == 'AG' || data[i].Brand == 'JMW' || data[i].Brand == 'NKE'){
        await client.query(`INSERT INTO readings(device, date, volume)  VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`, 
          [data[i].Device, new Date(data[i].Date), Number(data[i].Volume)]);
      }
    }
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    console.log(`${formattedDate} => ${data.length} readings inserted successfully!`);
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert Alarms
const insAlarms = async (data) => {
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
      if (data[i].Brand == 'AW' || data[i].Brand == 'AG' || data[i].Brand == 'JMW' || data[i].Brand == 'NKE'){
        await client.query(`INSERT INTO alarm2(device, date, alarm)  VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`, 
          [Number(data[i].Device), new Date(data[i].Date), data[i].Alarm]);
      }
    }
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    console.log(`${formattedDate} => ${data.length} alarms inserted successfully!`);
    // Release the client back to the pool
    client.release();
  }
};


async function readings(data) {
  try {
    const fetch = await makeRequest();
    const clean = await cleanData(fetch);
    // Get current date and the cut-off date (1 day ago)
    const currentDate = new Date();
    const cutOffDate = new Date(currentDate.setHours(currentDate.getHours() - 24));
    // Filter out records older than e days
    const recentRecords = clean.filter(record => new Date(record.Date) >= cutOffDate);
    // Sort the filtered records by Date (ascending)
    recentRecords.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    // Clone the recentRecords before modifying Device values
    const modifiedRecords = recentRecords.map(record => ({ ...record }));
    // Map devices for quick lookup
    const deviceMap = new Map(devices.map(device => [device.sn, device.meter]));
    // Replace serial numbers with meter names in the cloned records
    modifiedRecords.forEach(record => {
      if (deviceMap.has(record.Device)) {
        record.Device = deviceMap.get(record.Device);
      }
    });
    // Insert the modified records (with Device substitution)
    await insReadings(modifiedRecords);
    await insAlarms(modifiedRecords);
    // Return the original recentRecords (without Device substitution)
    return recentRecords;
  } catch (error) {
    console.error('Error in readings:', error);
  }
}

export { readings };
