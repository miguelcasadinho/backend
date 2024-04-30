import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { resoTask } from './psql/reqso.js';
import { georeqTask } from './psql/georeq.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

// Define an async function to delete georequests
const deleteAllRecords  = async (tableName) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Delete all records from the specified table
    await client.query(`DELETE FROM ${tableName}`);
    // Commit the transaction
    await client.query('COMMIT');
    //console.log('All records deleted successfully from', tableName);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error deleting records:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to requests service orders data
const insertresodata = async (data) => {
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
      let date = new Date();
      for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO reqso(date, zmc, requests, orders) VALUES($1, $2, $3, $4) 
                            ON CONFLICT (zmc) DO UPDATE SET date = EXCLUDED.date, requests = EXCLUDED.requests, orders = EXCLUDED.orders`,
                            [date, data[i].zmc, Number(data[i].requests), Number(data[i].orders) ]);
      }
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${formattedDate} => ${data.length} records of navia requests per zmc inserted successfully!`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
  };

  // Define an async function to insert georequests
const insertgeoreqdata = async (data) => {
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
    for (let i=0; i < data.length ; i++){
      await client.query(`INSERT INTO georequest(date, request, symptom, state, street, locality, zmc, lat, lon) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                        [data[i].Data, data[i].Requisicao, data[i].Sintoma, data[i].Estado, data[i].Morada, data[i].Localidade, data[i].ZMC, data[i].Lat, data[i].Lon]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${data.length} records of georreferenced navia open requests inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

const insreso = async () => {
  try {
      const qresodata = await resoTask();
      //console.log(qresodata);
      await insertresodata(qresodata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insgeoreq = async () => {
  try {
      await deleteAllRecords('georequest');
      const georeqdata = await georeqTask();
      //console.log(georeqdata);
      await insertgeoreqdata(georeqdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};
  
export { insreso, insgeoreq };
