import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlNaviaHost,
    port: process.env.psqlNaviaPort,
    user: process.env.psqlNaviaUser,
    password: process.env.psqlNaviaPassword,
    database: process.env.psqlNaviaDatabase
});

const query = `
    SELECT 
        so.id_service_order, 
        so.number,
        rq.date_hour_created, 
        so.date_hour_executed,
        round((EXTRACT(EPOCH FROM (so.date_hour_executed - rq.date_hour_created)) / (3600*24))::NUMERIC, 2) AS resp_days, 
        so.symptom, 
        so.user_create, 
        so.user_execute, 
        so.address, 
        STRING_AGG(wk.work, ', ') AS work  
    FROM vw.service_orders AS so
    LEFT JOIN vw.requests AS rq ON so.id_request = rq.id_request
    LEFT JOIN vw.service_orders_cause_work AS wk ON so.id_service_order = wk.id_service_order
    WHERE 
    rq.symptom SIMILAR TO '%Fuga de água não visível%|%Rotura%'
    AND 
        so.date_hour_executed >= NOW() - INTERVAL '24 hours'
    GROUP BY 
        so.id_service_order, 
        so.number,
        rq.date_hour_created,  
        so.date_hour_executed,
        round((EXTRACT(EPOCH FROM (so.date_hour_executed - rq.date_hour_created)) / (3600*24))::NUMERIC, 2), 
        so.symptom, 
        so.user_create, 
        so.user_execute, 
        so.address;
`;

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

const leakTask = async () => {
    try {
        const leakdata = await executeQuery(query);
        //console.log(leakdata);
        return leakdata;
    } catch (error) {
        console.error('Error fetching leak data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { leakTask };
leakTask();
