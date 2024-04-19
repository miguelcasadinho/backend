import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { qhourdataTask } from './sqlserver/qhour.js';
import { volmendataTask } from './sqlserver/volmensal.js';
import { qmindataTask } from './sqlserver/qmin24.js';
import { qmin48dataTask } from './sqlserver/qmin48.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

// Define an async function to insert qhour
const insertqhourdata = async (qhourdata) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      // Iterate over the data and execute insert queries
      for (let i=0; i < qhourdata.length ; i++){
        for (let j=1; j < qhourdata[i].length -1; j++){
          await client.query(`INSERT INTO zmcflowdis(tag_id, date, flow) VALUES($1, $2, $3) ON CONFLICT (tag_id, date) DO UPDATE SET
                    flow = EXCLUDED.flow`, [qhourdata[i][j].Tag_ID, new Date(qhourdata[i][j].date), Number(qhourdata[i][j].flow)]);
        }
      }
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

// Define an async function to insert dist monthly volume  
const insertvolmendata = async (volmendata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < volmendata.length ; i++){
      await client.query(`INSERT INTO zmcvol(tag_id, date, volume) VALUES($1, $2, $3)`, 
      [Number(volmendata[i].tag_id), new Date(volmendata[i].date), Number(volmendata[i].vol)]);
    }
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

// Define an async function to insert qmin24h
const insertqmin24data = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO qmin(tag_id, date, flow)  VALUES($1, $2, $3)  ON CONFLICT (tag_id) DO UPDATE SET
        date = EXCLUDED.date, flow = EXCLUDED.flow`, [Number(data[i].tag_ID), new Date(data[i].Date), Number(data[i].Value)]);
    }
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

// Define an async function to insert qmin24h
const insertqmin4evdata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO qmin4ev(tag_id, date, flow)  VALUES($1, $2, $3)  ON CONFLICT (tag_id) DO UPDATE SET
        date = EXCLUDED.date, flow = EXCLUDED.flow`, [Number(data[i].tag_ID), new Date(data[i].Date), Number(data[i].Value)]);
    }
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

// Define an async function to insert qmin24h
const insertqmin48data = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO qmin48(tag_id, date, flow)  VALUES($1, $2, $3)  ON CONFLICT (tag_id) DO UPDATE SET
        date = EXCLUDED.date, flow = EXCLUDED.flow`, [Number(data[i].tag_ID), new Date(data[i].Date), Number(data[i].Value)]);
    }
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

const insqhour = async () => {
  try {
      const qhourdata = await qhourdataTask();
      // console.log(qhourdata);
      await insertqhourdata(qhourdata); // Wait for insertqhourdata to finish
      //await pool.end(); // Close the connection pool after insertqhourdata completes
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insvolmen = async () => {
  try {
      const volmendata = await volmendataTask();
      // console.log(volmendata);
      await insertvolmendata(volmendata); // Wait for insertvolmendata to finish
      //await pool.end(); // Close the connection pool after insertvolmendata completes
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insqmin = async () => {
  try {
      const qmindata = await qmindataTask();
      // console.log(qmindata);
      await insertqmin24data(qmindata);
      await insertqmin4evdata(qmindata);
      const qmin48data = await qmin48dataTask();
      // console.log(qmin48data);
      await insertqmin48data(qmin48data); 
      //await pool.end(); // Close the connection pool after insertqhourdata completes
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

export { insqhour, insvolmen, insqmin };
  