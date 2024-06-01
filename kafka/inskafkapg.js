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

// Define an async function to insert flow
const insertflow = async (flowdata) => {
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
    await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO UPDATE SET
            flow = EXCLUDED.flow`, [flowdata.device, new Date(flowdata.date), Number(flowdata.flow)]);
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${formattedDate} => ${flowdata.device}, flow inserted successfully!`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert volume
const insertvol = async (voldata) => {
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
    await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3) ON CONFLICT (device, date) DO UPDATE SET
            volume = EXCLUDED.volume`, [voldata.device, new Date(voldata.date), Number(voldata.volume)]);
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${formattedDate} => ${voldata.device}, volume inserted successfully!`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

export { insertflow, insertvol };