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
      const data_tr = new Date();
      const year = data_tr.getFullYear();
      const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
      const day = String(data_tr.getDate()).padStart(2, '0');
      const hour = String(data_tr.getHours()).padStart(2, '0');
      const min = String(data_tr.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
      await client.query(`INSERT INTO water_leak(device, model, version, date, battery, signal, alarm, count_mod, tdc_flag, leak_status, leak_times, leak_duration) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                        [payload.IMEI, payload.model, payload.version, payload.data, payload.battery, payload.signal,
                        payload.alarm, payload.mod, payload.tdc_flag, payload.leak_status, payload.leak_times, payload.leak_duration]);
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${formattedDate} => ${payload.IMEI}, data inserted successfully!`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert flow cpl03 water meters
const insertFlow = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
      const data_tr = new Date();
      const year = data_tr.getFullYear();
      const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
      const day = String(data_tr.getDate()).padStart(2, '0');
      const hour = String(data_tr.getHours()).padStart(2, '0');
      const min = String(data_tr.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
      for (let i=0; i < payload.deltas.length ; i++){
        await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`,
                            [payload.device, payload.deltas[i].date, payload.deltas[i].flow]);
      }
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${formattedDate} => ${payload.device}, data inserted successfully!`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert flow xlogic water meters
const getHistVolume = async (device) => {
  const query = {
      text: `
          SELECT 
              device,
              date,
              volume
          FROM 
              volume
          WHERE
              device = $1 AND date >= NOW() - INTERVAL '75 minutes';`,
      values: [device]
  };

  try {
      const client = await pool.connect();
      const result = await client.query(query);
      client.release();
      return result.rows[0].volume;
  } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Failed to execute query');
  }
};

const insertXlogicFlow0 = async (payload, last_volume) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    //Execute insert querie
      await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`,
                          [payload.device, payload.date, payload.volume - last_volume]);
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

const insertXlogicFlow = async (payload) => {
  try {
      const lastVolume = await getHistVolume(payload.device);
      if (typeof lastVolume !== 'undefined'){
          //console.log(lastVolume);
          insertXlogicFlow0(payload, lastVolume);
      }
  } catch (error) {
      console.error('Error in insertXlogicFlow:', error.message);
      return [];
  }
};



// Define an async function to insert cpl03 water meter volume
const insertVolume = async (payload) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    //Execute insert querie
      await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`,
                          [payload.device, payload.deltas[0].date, payload.volume]);
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert xlogic water meter volume
const insertXlogicVolume = async (payload) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    //Execute insert querie
      await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`,
                          [payload.device, payload.date, payload.volume]);
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert cpl03 water meter battery
const insertBattery = async (payload) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    //Execute insert querie
    var data_tr = new Date();
    await client.query(`INSERT INTO battery(device, date, battery) VALUES($1, $2, $3)`,
                      [payload.device, payload.deltas[0].date, payload.battery]);
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert xlogic water meter battery
const insertXlogicBattery = async (payload) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    //Execute insert querie
    var data_tr = new Date();
    await client.query(`INSERT INTO battery(device, date, battery) VALUES($1, $2, $3)`,
                      [payload.device, payload.date, payload.battery]);
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert cpl03 water meter transmission
const insertTransmission = async (payload) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    //Execute insert querie
      await client.query(`INSERT INTO transmission(device, date, signal) VALUES($1, $2, $3)`,
                          [payload.device, payload.deltas[0].date, payload.signal]);
    // Commit the transaction
    await client.query('COMMIT');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert xlogic water meter transmission
const insertXlogicTransmission = async (payload) => {
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
    //Execute insert querie
      await client.query(`INSERT INTO transmission(device, date, snr, signal) VALUES($1, $2, $3, $4)`,
                          [payload.device, payload.date, payload.SNR, payload.RSRQ]);
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${payload.device}, data inserted successfully!`);
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


const insertMeters = async (payload) => {
  try {
    switch (payload.model) {
      case 'CPL03-NB':
        insertFlow(payload);
        insertVolume(payload);
        insertBattery(payload);
        insertTransmission(payload);
        break;
      case 'X-Logic':
        insertXlogicFlow(payload);
        insertXlogicVolume(payload);
        insertXlogicBattery(payload);
        insertXlogicTransmission(payload);
        break;
      default:
        console.log('Unsupported Model:', payload.model);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

export { insertPg, insertMeters };  