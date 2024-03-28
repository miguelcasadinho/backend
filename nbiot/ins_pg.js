import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});


// Define an async function to insert water leak
const insertWl = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
      await client.query(`INSERT INTO water_leak(device, model, version, date, battery, signal, alarm, count_mod, tdc_flag, leak_status, leak_times, leak_duration) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                        [payload.IMEI, payload.model, payload.version, payload.data, payload.battery, payload.signal,
                        payload.alarm, payload.mod, payload.tdc_flag, payload.leak_status, payload.leak_times, payload.leak_duration]);
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${payload.IMEI} , overflow details inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

const insertPg = async (payload) => {
    try {
        var model = payload.model;
        switch (model) {
            case 'WL03A-NB':
                insertWl(payload);
            break;
            default:
                console.log('Unsupported Model:', payload.model);
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

export { insertPg };  