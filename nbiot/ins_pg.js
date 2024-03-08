import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
import pg from 'pg';

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

const insertPg = (payload) => {
    var model = payload.model;
    switch (model) {
        case 'WL03A-NB':
            insertWl(payload);
          break;
        default:
    }
};

const insertWl = (payload) => {
    const query_wl = `INSERT INTO water_leak(device, model, version, date, battery, signal, alarm, count_mod, tdc_flag, leak_status, leak_times, leak_duration) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
    var values = [payload.IMEI, payload.model, payload.version, payload.data, payload.battery, payload.signal,
                  payload.alarm, payload.mod, payload.tdc_flag, payload.leak_status, payload.leak_times, payload.leak_duration];
    pool.query(query_wl, values, (error, response) => {
        if (error) {
            console.log(error);
        }
    });
};

export { insertPg };  