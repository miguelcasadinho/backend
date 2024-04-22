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
        COALESCE((SELECT 
                    volume
                FROM 
                    volume
                WHERE 
                    device = $1 
                    AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                    AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
                ORDER BY 
                    date DESC -- Order by date in descending order to get the last value
                LIMIT 1), 
                (SELECT 
                    volume
                FROM 
                    volume
                WHERE 
                    device = $1 
                    AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month') 
                    AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
                ORDER BY 
                    date DESC -- Order by date in descending order to get the last value
                LIMIT 1)) -
        COALESCE((SELECT 
                    volume
                FROM 
                    volume
                WHERE 
                    device = $1 
                    AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month') 
                    AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
                ORDER BY 
                    date ASC -- Order by date in ascending order to get the first value
                LIMIT 1), 0) AS vol`,
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
    const volmensaldata = [];
    try {
        for (const device of devices) {
            const result = await executeQuery(device);
            if (result.length > 0) {
                volmensaldata.push({
                    tag_id : device,
                    date : new Date(),
                    vol : result[0].vol});
            }
        }
        return volmensaldata;
    } catch (error) {
        throw error;
    }
};

const volmensallora = async () => {
    try {
        const queryResults = await executeAllQueries();
        console.log(queryResults.length, 'records retrieved');
        console.log(queryResults);
        return queryResults;
    } catch (error) {
        console.error('Error in volmensallora:', error.message);
        return [];
    }
};

export { volmensallora };

volmensallora();