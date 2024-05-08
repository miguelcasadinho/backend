import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { devices } from './devices.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

const executeQuery = async (device) => {
    const query = {
        text: `
            SELECT 
                device as "Tag_ID",
                date_trunc('hour', date) AS date,
                round(sum(flow)/count(flow), 2) as flow,
                count(*) as n
            FROM 
                flow
            WHERE
                device = $1 AND date >= NOW() - INTERVAL '25 hours'
            GROUP BY 
                date_trunc('hour', date), device
            ORDER BY 
                date desc;`,
        values: [device]
    };

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Failed to execute query');
    }
};

const executeAllQueries = async () => {
    const qhourdata = [];
    try {
        for (const device of devices) {
            const result = await executeQuery(device);
            if (result.length > 0) {
                qhourdata.push(result);
            }
        }
        return qhourdata.flat();
    } catch (error) {
        throw error;
    }
};

const qhourlora = async () => {
    try {
        const queryResults = await executeAllQueries();
        //console.log(queryResults.length, 'records retrieved');
        //console.log(queryResults);
        return queryResults;
    } catch (error) {
        console.error('Error in qhourlora:', error.message);
        return [];
    }
};

export { qhourlora };
