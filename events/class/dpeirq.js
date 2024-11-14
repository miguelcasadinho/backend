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
    so.address,
    so.symptom,
    wc.work,
    so.user_execute,
    so.date_hour_end  
FROM 
    vw.service_orders as so
LEFT JOIN (
    SELECT * 
    FROM vw.requests 
) AS rq
ON so.id_request = rq.id_request
LEFT JOIN (
    SELECT * 
    FROM vw.service_orders_cause_work
) AS wc
ON so.id_service_order = wc.id_service_order
WHERE
    rq.user_create = 'DPEI'
    AND 
    (
    rq.symptom LIKE 'DOMA » Abastecimento » Válvulas » Válvulas\%' OR
    rq.symptom LIKE 'DOMA » Abastecimento » Gestão de contadores%' OR
    rq.symptom LIKE 'DOMA » Abastecimento » Condutas e ramais » Ramais%'
    )
    AND
    so.date_hour_executed >= now() - INTERVAL '24 hours';
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

const dpeirqTask = async () => {
    try {
        const dpeirqdata = await executeQuery(query);
        //console.log(dpeirqdata);
        return dpeirqdata;
    } catch (error) {
        console.error('Error fetching dpei requests data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { dpeirqTask };
