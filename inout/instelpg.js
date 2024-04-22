import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { qhourdataTask } from './sqlserver/qhour.js';
import { qhourlora } from './psql/qhour.js';
import { volmendataTask } from './sqlserver/volmensal.js';
import { volmensallora } from './psql/volmensal.js';
import { qmindataTask } from './sqlserver/qmin24.js';
import { qmin48dataTask } from './sqlserver/qmin48.js';
import { qmin24lora } from './psql/qmin24h.js';
import { qmin48lora } from './psql/qmin48h.js';
import { qliqdataTask } from './psql/qliq.js';
import { kpigisdataTask } from './sqlserver/kpigis.js';
import { kpiaquadataTask } from './psql/kpiaqua.js';
import { kpiqminmddataTask } from './psql/kpiqminmd.js';
import { kpiqminliqdataTask } from './psql/kpiqminliq.js';

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
        await client.query(`INSERT INTO qmin4ev(tag_id, date, flow)  VALUES($1, $2, $3)`, [Number(data[i].tag_ID), new Date(data[i].Date), Number(data[i].Value)]);
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

// Define an async function to insert qliq
const insertqliqdata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO zmcqliq(zmc, date, dis, tel, liq) VALUES($1, $2, $3, $4, $5)  ON CONFLICT (zmc, date) DO UPDATE SET
                            dis = EXCLUDED.dis, tel = EXCLUDED.tel, liq = EXCLUDED.liq`, 
                            [data[i].zmc, data[i].hour, Number(data[i].dist), Number(data[i].telemetria), Number(data[i].liq)]);
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

// Define an async function to insert kpigis
const insertkpigisdata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO kpi(zmc, tub_l, ram_n, ram_lm) VALUES($1, $2, $3, $4)  ON CONFLICT (zmc) DO UPDATE SET
                            tub_l = EXCLUDED.tub_l, ram_n = EXCLUDED.ram_n, ram_lm = EXCLUDED.ram_lm`, 
                            [data[i].zmc, Number(data[i].Condutas_length), Number(data[i].Ramais_number), Number(data[i].Ramais_length_med)]);
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

// Define an async function to insert kpiaqua
const insertkpiaquadata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO kpi(zmc, cli, cli_dom) VALUES($1, $2, $3)  ON CONFLICT (zmc) DO UPDATE SET
                            cli = EXCLUDED.cli, cli_dom = EXCLUDED.cli_dom`, 
                            [data[i].zmc, Number(data[i].clients), Number(data[i].clientsdom)]);
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

// Define an async function to insert kpiqminmd
const insertkpiqminmddata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO kpi(zmc, qmin, qmd) VALUES($1, $2, $3)  ON CONFLICT (zmc) DO UPDATE SET
                            qmin = EXCLUDED.qmin, qmd = EXCLUDED.qmd`, 
                            [data[i].zmc, Number(data[i].qmin), Number(data[i].qmd)]);
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

// Define an async function to insert kpiqminliq
const insertkpiqminliqdata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO kpi(zmc, qliq) VALUES($1, $2)  ON CONFLICT (zmc) DO UPDATE SET qliq = EXCLUDED.qliq`, 
                            [data[i].zmc, Number(data[i].qliq)]);
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
      const qhourloradata = await qhourlora();
      // console.log(qhourloradata);
      await insertqhourdata(qhourloradata); // Wait for insertqhourdata to finish
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
      const volmenloradata = await volmensallora();
      // console.log(volmenloradata);
      await insertvolmendata(volmenloradata); // Wait for insertvolmendata to finish
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
      const qminloradata = await qmin24lora();
      // console.log(qminloradata);
      await insertqmin24data(qminloradata);
      await insertqmin4evdata(qminloradata);
      const qmin48data = await qmin48dataTask();
      // console.log(qmin48data);
      await insertqmin48data(qmin48data);
      const qmin48loradata = await qmin48lora();
      // console.log(qmin48loradata);
      await insertqmin48data(qmin48loradata);
      //await pool.end(); // Close the connection pool after insertqhourdata completes
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insqliq = async () => {
  try {
      const qliqdata = await qliqdataTask();
      // console.log(qliqdata);
      await insertqliqdata(qliqdata); 
      //await pool.end(); // Close the connection pool after insertvolmendata completes
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const inskpi = async () => {
  try {
      const kpigisdata = await kpigisdataTask();
      // console.log(kpigisdata);
      await insertkpigisdata(kpigisdata);
      const kpiaquadata = await kpiaquadataTask();
      // console.log(kpiaquadata);
      await insertkpiaquadata(kpiaquadata);
      const kpiqminmddata = await kpiqminmddataTask();
      // console.log(kpiqminmddata);
      await insertkpiqminmddata(kpiqminmddata);
      const kpiqminliqdata = await kpiqminliqdataTask();
      // console.log(kpiqminliqdata);
      await insertkpiqminliqdata(kpiqminliqdata);
      //await pool.end(); // Close the connection pool after insertqhourdata completes
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

export { insqhour, insvolmen, insqmin, insqliq, inskpi };
  