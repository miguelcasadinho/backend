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

// Define an async function to insert Arquiled devices flow
const insertFlowArq = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
            // Iterate over the data and execute insert queries
      for (let i=0; i < payload.Deltas.length ; i++){  
        let data = new Date(payload.Date);
        let currentMinutes = data.getMinutes();
        if (currentMinutes >= 50) {
            data.setHours(data.getHours());
        }
        else {
            data.setHours(data.getHours() -1);
        }
        data.setMinutes(0);
        data.setSeconds(0);
        data.setMilliseconds(0);   
  
        let hour = data.getHours();
        hour=hour-i;
        data.setHours(hour);
        await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`,
                          [payload.DeviceName, data, payload.Deltas[i]]);
      }
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , flow inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Axioma devices flow (34)
const insertFlow = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      // Iterate over the data and execute insert queries
      for (let i=0; i < payload.Deltas.length ; i++){
        let data = new Date(payload.Date_log);
        let hour =data.getHours();
        if (payload.rph !== undefined){
            let min = data.getMinutes();
            min=min+60+(60*i/payload.rph);
            data.setMinutes(min);
        }
        else {
            hour=hour+1+i;
            data.setHours(hour);
        } 
        await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`,
                          [payload.DeviceName, data, payload.Deltas[i]]);
      }
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , flow inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Diehl devices flow (83)
const insertFlowDiehl = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      // Iterate over the data and execute insert queries
      for (let i=0; i < payload.Deltas.length ; i++){
        let data = new Date(payload.Datelog);
        let hour =data.getHours();
        hour=hour+i;
        data.setHours(hour);
        if (['81541670'].includes(payload.DeviceName)){
            await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`,
                          [payload.DeviceName, data, payload.Deltas[i]*0.01]);
        }
        else {
            await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`,
                            [payload.DeviceName, data, payload.Deltas[i]*0.001]);
        }                 
      }
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , flow inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Janzv2 devices flow ()
const insertFlowJanz2 = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      // Iterate over the data and execute insert queries
      for (let i=0; i < payload.Deltas.length ; i++){
        let data = new Date(payload.Date);
        if (payload.Index == '12h00 to 00h00'){
            data.setHours(0);
            data.setMinutes(0);
            data.setSeconds(0);
        }
        else if (payload.Index == '00h00 to 12h00'){
            data.setHours(12);
            data.setMinutes(0);
            data.setSeconds(0);
        };
        let hour =data.getHours();
        hour=hour-i;
        data.setHours(hour);
        await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`,
                          [payload.DeviceName, data, payload.Deltas[i]*0.001]);
      }
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , flow inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Gladiator, Sagemcom, xtr, arrow, Janzvlora devices flow (42, 45, 80, 81, 119)
const insertFlow2 = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      // Iterate over the data and execute insert queries
      for (let i=0; i < payload.Deltas.length ; i++){
        let data = new Date(payload.Date);
        let hour =data.getHours();
        hour=hour-i;
        data.setHours(hour);
        await client.query(`INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`,
                          [payload.DeviceName, data, payload.Deltas[i]]);
      }
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , flow inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};


const getArrowVol11h = async (payload) => {
    try {
        //const { DeviceName, Date } = payload;
        const data12h = new Date(payload.Date);
        data12h.setHours(12, 0, 0, 0);
        const data10h = new Date(data12h);
        data10h.setHours(10);

        const query = {
            text: `
            SELECT 
                date,
                volume
            FROM 
                volume
            WHERE
                device = $1 AND date > $2 AND date < $3;`,
            values: [payload.DeviceName, data10h, data12h]
        };

        const client = await pool.connect();
        const result = await client.query(query);
        client.release();

        return result.rows.length > 0 ? parseFloat(result.rows[0].volume) : null;
    } catch (error) {
        console.error('Error executing getArrowVol11h:', error.message || error);
        throw new Error('Failed to retrieve volume data');
    }
};

const getArrowVol13hto23h = async ({ Deltas }) => {
    if (!Array.isArray(Deltas)) {
        throw new Error('Deltas must be an array');
    }
    return Deltas.reduce((acc, delta) => acc + delta, 0);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const insertFlowArrow2 = async (payload) => {
    const client = await pool.connect();
    try {
        const { DeviceName, Date: payloadDate, Deltas, Volume, Volume_fin } = payload;
        const delta24h = Volume_fin - Volume;

        await delay(5000); // Adjustable if needed

        const vol11h = await getArrowVol11h(payload);
        if (vol11h === null) {
            console.warn('Volume at 11h is missing.');
            return;
        }

        const vol13hto23h = await getArrowVol13hto23h(payload);
        const delta12h = Math.max(0, (Volume_fin - vol11h) - (vol13hto23h + delta24h));

        await client.query('BEGIN');

        const baseDate = new Date(payloadDate);
        for (let i = 0; i < Deltas.length; i++) {
            const data = new Date(baseDate);
            data.setHours(data.getHours() - i);

            await client.query(
                `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)
                ON CONFLICT (device, date) DO NOTHING`,
                [DeviceName, data, Deltas[i]]
            );
        }

        const data12h = new Date(payloadDate);
        data12h.setHours(12, 0, 0, 0);
        await client.query(
            `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)
            ON CONFLICT (device, date) DO NOTHING`,
            [DeviceName, data12h, delta12h]
        );

        const data24h = new Date(payloadDate);
        data24h.setHours(0, 0, 0, 0);
        await client.query(
            `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)
            ON CONFLICT (device, date) DO NOTHING`,
            [DeviceName, data24h, delta24h]
        );

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error inserting data:', err);
    } finally {
        if (client) client.release();
    }
};


const insertFlowArrow3 = (payload) => {
    var d24 = (payload.Volume_fin - payload.Volume);
    var vol11h;
    var d12;
    //select the volume from 11h
    var data12h = new Date(payload.Date);
    var hour12h = data12h.getHours();
    data12h.setHours(12);
    data12h.setMinutes(0);
    data12h.setSeconds(0);
    var data10h = new Date(data12h);
    var hour10h = data12h.getHours();
    data10h.setHours(hour10h-2);
    var query_11h = {
        name: '11h',
        text: 'SELECT date, volume FROM volume WHERE device = $1 AND (date > $2 and date < $3)',
        values: [payload.DeviceName, data10h, data12h],
    }
    pool.query(query_11h, (error, response) => {
        if (error) {
            console.log(error);
        }
        else {      
            vol11h = parseFloat(response.rows[0].volume);  
        }    
    });
    var vol24h = payload.Volume_fin;
    var cons13_23 = 0;
    for (var i = 0; i < payload.Deltas.length; i++){
        cons13_23 = cons13_23 + payload.Deltas[i];
    }
    setTimeout(function() {
        d12 = ((vol24h-vol11h) - (cons13_23 + d24));
            if (d12 < 0){
                d12 = 0
            };   
    }, 500);
    
    setTimeout(function() {
        //inserting the data
        for (i=0; i < payload.Deltas.length; i++){
            const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
            var data = new Date(payload.Date);
            var hour = data.getHours();
            hour=hour-i;
            data.setHours(hour);
            var values = [payload.DeviceName, data, payload.Deltas[i]];
            pool.query(query, values, (error, response) => {
                if (error) {
                    console.log(error);
                };
            });
        };
        const query_d12 = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
        var data12h = new Date(payload.Date);
        var hour12h = data12h.getHours();
        data12h.setHours(12);
        data12h.setMinutes(0);
        data12h.setSeconds(0);
        values = [payload.DeviceName, data12h, d12];
        pool.query(query_d12, values, (error, response) => {
            if (error) {
                console.log(error);
            };
        });
        const query_d24 = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
        var data24h = new Date(payload.Date);
        var hour24h = data24h.getHours();
        data24h.setHours(0);
        data24h.setMinutes(0);
        data24h.setSeconds(0);
        values = [payload.DeviceName, data24h, d24];
        pool.query(query_d24, values, (error, response) => {
            if (error) {
                console.log(error);
            };
        });   
    }, 1000);
};

const insertFlowNke = (payload) => {
    //inserting the aux data
    if (payload.index1.length > 0) { 
        for (var i=0; i < payload.index1.length; i++){
            var query_index1 = `INSERT INTO nkeaux(device, date, flow) VALUES($1, $2, $3)`;
            var values = [payload.index1[i].device, payload.index1[i].date, payload.index1[i].flow];
            pool.query(query_index1, values, (error, response) => {
                if (error) {
                    console.log(error);
                };
            });
        };
    };
    if (payload.index2.length > 0) { 
        for (var i=0; i < payload.index2.length; i++){
            var query_index2 = `INSERT INTO nkeauxinv(device, date, flow) VALUES($1, $2, $3)`;
            var values = [payload.index2[i].device, payload.index2[i].date, payload.index2[i].flow_inv];
            pool.query(query_index2, values, (error, response) => {
                if (error) {
                    console.log(error);
                };
            });
        };
    };

    //Get the aux data
    var flow;
    var flow_inv;
    if (payload.index1.length > 0) {
        var data = new Date(payload.index1[0].date);
        var hour =data.getHours();
        hour=hour-2;
        data.setHours(hour);
        var query_index1 = {
            name: 'index1-partial',
            text: 'SELECT device, date, flow - lag(flow) over (order by date) as flow, pg_sleep(1) FROM nkeaux WHERE device = $1 AND date >= $2',
            values: [payload.index1[0].device, data],
        };
        setTimeout(() => {
            pool.query(query_index1, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    flow = res.rows
                    // console.log(flow)
                    //inserting the data
                    for (let i=0; i < flow.length; i++){
                        const q1 = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT(device, date) DO NOTHING`;
                        const values = [flow[i].device, flow[i].date, flow[i].flow];
                        pool.query(q1, values, (error, response) => {
                            if (error) {
                                console.log(error);
                            };
                        });
                    };
                };
            });
        }, 2000);
    };
    if (payload.index2.length > 0) {
        var data_inv = new Date(payload.index2[0].date);
        var hour_inv = data_inv.getHours();
        hour_inv=hour_inv-2;
        data_inv.setHours(hour_inv);        
        var query_index2 = {
            name: 'index2-partial',
            text: 'SELECT device, date, flow - lag(flow) over (order by date) as flow, pg_sleep(3) FROM nkeauxinv WHERE device = $1 AND date >= $2',
            values: [payload.index2[0].device, data_inv],
        };
        setTimeout(() => {
            pool.query(query_index2, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    flow_inv = res.rows
                    //console.log(flow_inv)
                    //inserting the data
                    for (var i=0; i < flow_inv.length; i++){
                        const q2 = `INSERT INTO flow_inv(device, date, flow) VALUES($1, $2, $3)`;
                        var values = [flow_inv[i].device, flow[i].date, flow_inv[i].flow];
                        pool.query(q2, values, (error, response) => {
                            if (error) {
                                console.log(error);
                            };
                        });
                    };
                };
            });
        }, 4000);
    };
};

// Define an async function to insert Axioma, Gladiator, Sagemcom, xtr, Arrow, Janzv2, janzvlora, devices volume (34, 42, 45, 80, 81, 82, 119)
const insertVolume = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
        await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`,
                            [payload.DeviceName, payload.Date, payload.Volume]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , volume inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert nke devices volume (39)
const insertVolumeNke = async (payload) => {
    const client = await pool.connect();
    try {
        // Begin a transaction
        await client.query('BEGIN');
        if (payload.index1.length > 0) {
        //Execute insert querie
            await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`,
                                [payload.DeviceName, payload.Date, payload.Volume]);
        }
        if (payload.index2.length > 0) {
            //Execute insert querie
                await client.query(`INSERT INTO volume_inv(device, date, volume) VALUES($1, $2, $3)`,
                                    [payload.DeviceName, payload.Date, payload.Volume_inv]);
        }
        // Commit the transaction
        await client.query('COMMIT');
        //console.log(`${payload.Application}, ${payload.DeviceName} , volume inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Diehl volume ()
const insertVolumeDiehl = async (payload) => {
    const client = await pool.connect();
    try {
        // Begin a transaction
        await client.query('BEGIN');
        let datavol = new Date(payload.Date);
        datavol.setHours(0);
        datavol.setMinutes(0);
        datavol.setSeconds(0);
        datavol.setMilliseconds(0);
        //Execute insert querie
        if (['81541670'].includes(payload.DeviceName)){
            await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3) ON CONFLICT (device, date) DO UPDATE SET volume = EXCLUDED.volume`,
                            [payload.DeviceName, datavol, payload.Volume*10]);
        }
        else {
            await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3) ON CONFLICT (device, date) DO UPDATE SET volume = EXCLUDED.volume`,
                [payload.DeviceName, datavol, payload.Volume]);
        }
        
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , volume inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Axioma, Gladiator, Sagemcom, xtr, Arrow, Janzv2, Diehl, janzvlora, devices alarms (34, 42, 45, 80, 81, 82, 83, 119)
const insertAlarm = async (payload) => {
    let alarm;
    if (Array.isArray(payload.Alarm)) {
        alarm = payload.Alarm.join(', ');
    } else {
        alarm = payload.Alarm;
    }
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
        await client.query(`INSERT INTO alarm(device, date, alarm) VALUES($1, $2, $3)`,
                            [payload.DeviceName, payload.Date, alarm]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , alarms inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert nke, Gladiator, Janzv2 devices battery (39, 42, 82)
const insertBattery = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
      var data_tr = new Date();
      await client.query(`INSERT INTO battery(device, date, battery) VALUES($1, $2, $3)`,
                        [payload.DeviceName, payload.Date, payload.Battery]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , battery details inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert Axioma, nke, Gladiator, Sagemcom, xtr, Arrow, Janzv2, Diehl, Janzvlora, 
// sensecap, pslb, ldds devices transmissions (34, 39, 42, 45, 80, 81, 82, 83, 84, 85, 86, 119)
const insertCom = async (payload) => {
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
      await client.query(`INSERT INTO transmission(gateway,device, date, rssi, snr, sf) VALUES($1, $2, $3, $4, $5, $6)`,
                         [payload.gateway, payload.DeviceName, data_tr, payload.rssi, payload.snr, payload.sf]);
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`${formattedDate} => ${payload.Application}, Device:${payload.DeviceName}, data inserted successfully!`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert sensecap data (84)
const insertSensecap = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
      await client.query(`INSERT INTO weather(device, date, air_temperature, air_humidity, light_intensity, uv_index, wind_speed, wind_direction, rain_gauge, barometric_pressure)
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [payload.DeviceName, payload.Date, payload.air_temperature, payload.air_humidity, payload.light_intensity, payload.uv_index, 
                        payload.wind_speed, payload.wind_direction, payload.rain_gauge, payload.barometric_pressure]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , weather details inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert pslb data (85)
const insertPslb = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
      await client.query(`INSERT INTO pressure(device, date, pressure, battery, lat, lon) VALUES($1, $2, $3, $4, $5, $6)`,
                        [payload.DeviceName, payload.Date, payload.Deltas*10, payload.Battery, payload.Lat, payload.Lon]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , pressure details inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert ldds75 data (86)
const insertLdds75 = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
      await client.query(`INSERT INTO ldds75(device, date, battery, distance, lat, lon) VALUES($1, $2, $3, $4, $5, $6)`,
                        [payload.DeviceName, payload.Date, payload.Battery, payload.Distance, payload.Lat, payload.Lon]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , distance details inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert x-logic devices volume (152)
const insertXlogicVolume = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      //Execute insert querie
        await client.query(`INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`,
                            [payload.DeviceName, payload.Date, payload.Volume_IN1]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , volume inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

// Define an async function to insert x-logic devices flow (152)
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
        console.log('result: ',  result.rows.length );
        if (result.rows.length > 0){
                return result.rows[0].volume;
        }
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Failed to execute query');
    }
};

// Define an async function to insert x-logic devices flow (152)
const getLastHistVolume = async (device) => {
    const query = {
        text: `
            SELECT 
                device,
                date,
                volume
            FROM 
                volume
            WHERE
                device = $1 AND date >= NOW() - INTERVAL '24 hours'
            ORDER BY 
                date DESC
            LIMIT 1;`,
        values: [device]
    };

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        console.log('result: ',  result.rows.length );
        if (result.rows.length > 0){
                return result.rows[0].volume;
        }
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
                            [payload.DeviceName, payload.Date, payload.Volume_IN1-last_volume]);
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , volume inserted successfully`);
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
        const lastVolume = await getLastHistVolume(payload.DeviceName);
        //console.log(queryResults.length, 'records retrieved');
        if (typeof lastVolume !== 'undefined'){
            //console.log('Volume Log: ', lastVolume);
            insertXlogicFlow0(payload, lastVolume); 
        }
    } catch (error) {
        console.error('Error in insertXlogicFlow:', error.message);
        return [];
    }
};

// Define an async function to insert cpl03 devices readings
const insCpl03Volume = async (payload) => {
    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');
      // Iterate over the data and execute insert queries
      for (let i=0; i < payload.Volume_IN1.length ; i++){
        await client.query(`INSERT INTO volume(device, date, volume, tag_id) VALUES($1, $2, $3, $4) ON CONFLICT (device, date) DO NOTHING`,
                          [payload.DeviceName, payload.Volume_IN1[i].date, payload.Volume_IN1[i].volume, payload.Tag_id]);
      }
      // Commit the transaction
      await client.query('COMMIT');
      //console.log(`${payload.Application}, ${payload.DeviceName} , flow inserted successfully`);
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error inserting data:', err);
    } finally {
      // Release the client back to the pool
      client.release();
    }
};

const getCpl03Flow = async (device) => {
    const query = {
        text: `
            WITH calculated_flow AS (
                SELECT 
                    device,
                    date, 
                    (volume - LAG(volume) OVER (ORDER BY date)) / 
                    (EXTRACT(EPOCH FROM (date - LAG(date) OVER (ORDER BY date))) / 3600) AS flow,
                    EXTRACT(EPOCH FROM (date - LAG(date) OVER (ORDER BY date))) AS time_diff
                FROM volume 
                WHERE device = $1 AND date > now() - INTERVAL '6 hours'
            )
            SELECT device, date, flow
            FROM calculated_flow
            WHERE time_diff >= 60
            ORDER BY date ASC;
        `,
        values: [device],
    };

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows; // Return all rows
    } catch (error) {
        console.error('Error fetching flow data:', error);
        throw new Error('Failed to fetch flow data');
    }
};

const insertCpl03Flow = async (payload) => {
    const client = await pool.connect();
    try {
        // Begin a transaction
        await client.query('BEGIN');

        // Get flow data
        const flowData = await getCpl03Flow(payload.DeviceName);
        if (!flowData.length) {
            console.log(`No flow data for device: ${payload.DeviceName}`);
            await client.query('ROLLBACK');
            return;
        }

        // Prepare and execute batch insert
        const insertQuery = `
            INSERT INTO flow(device, date, flow, tag_id) 
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (device, date)
            --DO NOTHING
            DO UPDATE SET flow = EXCLUDED.flow;
        `;

        for (const flow of flowData) {
            await client.query(insertQuery, [flow.device, flow.date, flow.flow, payload.Tag_id]);
        }

        // Commit the transaction
        await client.query('COMMIT');
        //console.log(`${payload.Application}, ${payload.DeviceName} - Flow inserted successfully`);
    } catch (err) {
        // Rollback the transaction if an error occurs
        await client.query('ROLLBACK');
        console.error('Error inserting data:', err.message || err);
    } finally {
        // Release the client back to the pool
        client.release();
    }
};

const insertPg = async (payload) => {
    try {
        switch (payload.AppID) {
            case '34':
                insertFlow(payload);
                insertVolume(payload);
                insertAlarm(payload);
                insertCom(payload);
                break;
            case '39':
                insertFlowNke(payload);//falta otimizar
                insertVolumeNke(payload);
                insertBattery(payload);
                insertCom(payload);
                break;
            case '42':
                insertFlow2(payload);
                insertVolume(payload);
                insertAlarm(payload);
                insertBattery(payload);
                insertCom(payload);
                break;
            case '45':
                insertFlow2(payload);
                insertVolume(payload);
                insertAlarm(payload);
                insertCom(payload);
                break;
            case '80':
                insertFlow2(payload);
                insertVolume(payload);
                insertAlarm(payload);
                insertCom(payload);
                break;
            case '81':
                if (payload.fPort == 1){
                    insertFlow2(payload);
                }
                else if (payload.fPort == 2) {
                    insertFlowArrow2(payload);
                }
                insertVolume(payload);
                insertAlarm(payload);
                insertCom(payload);
                break;
            case '82':
                insertFlowJanz2(payload);
                insertVolume(payload);
                insertAlarm(payload);
                insertBattery(payload);
                insertCom(payload);
                break;
            case '83':
                insertFlowDiehl(payload);
                insertVolumeDiehl(payload);
                insertAlarm(payload);
                insertCom(payload);
                break;
            case '84':
                insertSensecap(payload);
                insertCom(payload);
                break;
            case '85':
                insertPslb(payload);
                insertCom(payload);
                break;
            case '86':
                insertLdds75(payload);
                insertCom(payload);
                break;
            case '119':
                if (payload.fPort == 1){
                    await insertFlow2(payload);
                }
                else if (payload.fPort == 2) {
                    insertFlowArrow2(payload);
                }
                insertVolume(payload);
                insertAlarm(payload);
                insertCom(payload);
                break;
            case '152':
                insertXlogicFlow(payload);
                insertXlogicVolume(payload);
                insertBattery(payload);
                insertCom(payload);
                break;
            case '153':
                insertFlowArq(payload);
                insertVolume(payload);
                insertAlarm(payload);
                insertBattery(payload);
                insertCom(payload);
                break;
            case '154':
                if (payload.fPort === 3) {
                    insertCom(payload);
                    insCpl03Volume(payload);
                } else if (payload.fPort === 6) {
                    insCpl03Volume(payload);
                    insertCom(payload);
                    setTimeout(() => insertCpl03Flow(payload), 15000); // Pass as a function reference
                } else if (payload.fPort === 5) {
                    insertBattery(payload);
                    insertCom(payload);
                };
                break;
            default:
                console.log('Unsupported AppID:', payload.AppID);
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};


export { insertPg };  





    
