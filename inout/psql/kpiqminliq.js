import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

const query = `SELECT zmc, min(liq) as qliq
FROM zmcqliq
where date > now() - interval '9 hours' 
group by zmc`;

const executeQuery = async (query, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // Rethrow the error for the caller to handle
    } finally {
        client.release();
    }
};

const kpiqminliqdataTask = async () => {
    try {
        const kpiqminliqdata = await executeQuery(query);
        //console.log(kpiqminliqdata);
        //console.log(kpiqminliqdata.length, "records fetched successfully");
        return kpiqminliqdata;
    } catch (error) {
        console.error('Error fetching qmin liq data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { kpiqminliqdataTask };

