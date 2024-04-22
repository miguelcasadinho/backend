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
                device as "tag_ID",
                date as "Date",
                MIN(flow) AS "Value"
            FROM
                flow
            WHERE
                device = $1 AND date >= NOW() - INTERVAL '33 hours' AND date < NOW() - INTERVAL '24 hours'
            GROUP BY
                device,
                date
            ORDER BY
                "Value" ASC
            LIMIT 1`,
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
    const qmindata = [];
    try {
        for (const device of devices) {
            const result = await executeQuery(device);
            if (result.length > 0) {
                qmindata.push(result[0]);
            }
        }
        return qmindata;
    } catch (error) {
        throw error;
    }
};

const qmin48lora = async () => {
    try {
        const queryResults = await executeAllQueries();
        console.log(queryResults.length, 'records retrieved');
        //console.log(queryResults);
        return queryResults;
    } catch (error) {
        console.error('Error in qmin48lora:', error.message);
        return [];
    }
};

export { qmin48lora };
