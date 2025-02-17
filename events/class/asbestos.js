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
    vw.service_orders.id_service_order, 
    vw.service_orders.number, 
    vw.service_orders.date_hour_executed AS date, 
    vw.service_orders.user_create AS creator, 
    vw.service_orders.user_responsible AS responsible, 
    vw.service_orders.symptom AS sympton, 
    vw.service_orders.address AS address, 
    inicio.value_time AS begin, 
    fim.value_time AS end, 
    operador1.value_domain AS operator1, 
    operador2.value_domain AS operator2, 
    operador3.value_domain AS operator3, 
    responsavel.value_domain AS supervisor
FROM 
    vw.service_orders
LEFT JOIN (
    SELECT * 
    FROM vw.records 
    WHERE variable = 'Intervenção em fibrocimento'
) AS records_main 
ON vw.service_orders.id_service_order = records_main.id_service_order
LEFT JOIN (
    SELECT * 
    FROM vw.records 
    WHERE variable = 'Intervenção em fibrocimento - início'
) AS inicio 
ON vw.service_orders.id_service_order = inicio.id_service_order
LEFT JOIN (
    SELECT * 
    FROM vw.records 
    WHERE variable = 'Intervenção em fibrocimento - fim'
) AS fim 
ON vw.service_orders.id_service_order = fim.id_service_order
LEFT JOIN (
    SELECT * 
    FROM vw.records 
    WHERE variable = 'Intervenção em fibrocimento - operador 1'
) AS operador1 
ON vw.service_orders.id_service_order = operador1.id_service_order
LEFT JOIN (
    SELECT * 
    FROM vw.records 
    WHERE variable = 'Intervenção em fibrocimento - operador 2'
) AS operador2 
ON vw.service_orders.id_service_order = operador2.id_service_order
LEFT JOIN (
    SELECT * 
    FROM vw.records 
    WHERE variable = 'Intervenção em fibrocimento - operador 3'
) AS operador3 
ON vw.service_orders.id_service_order = operador3.id_service_order
LEFT JOIN (
    SELECT * 
    FROM vw.records 
    WHERE variable = 'Intervenção em fibrocimento - responsável técnico'
) AS responsavel 
ON vw.service_orders.id_service_order = responsavel.id_service_order
WHERE 
    records_main.value_domain = 'Sim'
AND 
    vw.service_orders.date_hour_executed >= now() - INTERVAL '24 hour';
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

const asbestosdataTask = async () => {
    try {
        const asbestosdata = await executeQuery(query);
        //console.log(asbestosdata);
        return asbestosdata;
    } catch (error) {
        console.error('Error fetching asbestos data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { asbestosdataTask };
