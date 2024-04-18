import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { tubramdataTask } from './sqlserver/tub_ram.js';

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
      // Iterate over the data and execute insert queries
      for (let i=0; i < tub_ramdata.length ; i++){
        await client.query(`INSERT INTO gis_data(zmc, tubagens_l, ramais_n, ramais_l, ramais_lmed) VALUES($1, $2, $3, $4, $5) ON CONFLICT (zmc) DO UPDATE SET
                            tubagens_l = EXCLUDED.tubagens_l, ramais_n = EXCLUDED.ramais_n, ramais_l = EXCLUDED.ramais_l, ramais_lmed = EXCLUDED.ramais_lmed`, 
                            [tub_ramdata[i].ZMC, tub_ramdata[i].Condutas_length, tub_ramdata[i].Ramais_number, tub_ramdata[i].Ramais_length, tub_ramdata[i].Ramais_length_med]);
      };
      // Commit the transaction
      await client.query('COMMIT');
      console.log('Data inserted successfully');
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
  
  export { instub_ram };
  