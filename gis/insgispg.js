import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { tubramdataTask } from './sqlserver/tub_ram.js';
import { fatdataTask } from './sqlserver/fat.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

// Define an async function to insert GIS data  
const inserttub_ramdata = async (tub_ramdata) => {
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
      const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
      // Iterate over the data and execute insert queries
      for (let i=0; i < tub_ramdata.length ; i++){
        await client.query(`INSERT INTO gis_data(zmc, tubagens_l, ramais_n, ramais_l, ramais_lmed) VALUES($1, $2, $3, $4, $5) ON CONFLICT (zmc) DO UPDATE SET
                            tubagens_l = EXCLUDED.tubagens_l, ramais_n = EXCLUDED.ramais_n, ramais_l = EXCLUDED.ramais_l, ramais_lmed = EXCLUDED.ramais_lmed`, 
                            [tub_ramdata[i].ZMC, tub_ramdata[i].Condutas_length, tub_ramdata[i].Ramais_number, tub_ramdata[i].Ramais_length, tub_ramdata[i].Ramais_length_med]);
      };
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${formattedDate} => ${tub_ramdata.length} records of GIS pipes and literals inserted successfully!`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Fat data  
const insertfatdata = async (fatdata) => {
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
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < fatdata.length ; i++){
      await client.query(`INSERT INTO zmcvolfat(tag_id, date, volume) VALUES($1, $2, $3)`, 
                          [fatdata[i].zmc, data_tr, fatdata[i].volume]);
    };
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${fatdata.length} zmc's fat data inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

const instub_ram = async () => {
    try {
        const tub_ramdata = await tubramdataTask();
        // console.log(tub_ramdata);
        await inserttub_ramdata(tub_ramdata); 
        //await pool.end(); // Close the connection pool after insertvolmendata completes
        //console.log('Connection pool closed.');
    } catch (error) {
        console.error('Error:', error);
    }
  };
  
  const insfat = async () => {
    try {
        const fatdata = await fatdataTask();
        // console.log(fatdata);
        await insertfatdata(fatdata); 
        //await pool.end(); // Close the connection pool after insertvolmendata completes
        //console.log('Connection pool closed.');
    } catch (error) {
        console.error('Error:', error);
    }
  };

  export { instub_ram, insfat };

  