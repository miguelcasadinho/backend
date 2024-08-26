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
        vw.service_orders.id_service_order, vw.service_orders.number, vw.service_orders.date_hour_executed as date, vw.service_orders.user_create as creator, vw.service_orders.user_responsible as responsible, 
        vw.service_orders.symptom as sympton, vw.service_orders.address as address, inicio.value_time as begin, fim.value_time as end, operador1.value_domain as operator1, 
        operador2.value_domain as operator2, operador3.value_domain as operator3, responsavel.value_domain as supervisor
    FROM 
        vw.service_orders
    LEFT JOIN (
    SELECT 
        *
    FROM 
        vw.records WHERE records.variable = 'Intervenção em fibrocimento') as records 
    ON 
        vw.service_orders.id_service_order = records.id_service_order
    LEFT JOIN (
    SELECT 
        *
    FROM 
        vw.records WHERE records.variable = 'Intervenção em fibrocimento - início') as inicio 
    ON 
        vw.service_orders.id_service_order = records.id_service_order
    LEFT JOIN (
    SELECT 
        *
    FROM 
        vw.records WHERE records.variable = 'Intervenção em fibrocimento - fim') as fim 
    ON 
        vw.service_orders.id_service_order = records.id_service_order
    LEFT JOIN (
    SELECT 
        *
    FROM 
        vw.records WHERE records.variable = 'Intervenção em fibrocimento - operador 1') as operador1 
    ON 
        vw.service_orders.id_service_order = records.id_service_order
    LEFT JOIN (
    SELECT 
        *
    FROM 
        vw.records WHERE records.variable = 'Intervenção em fibrocimento - operador 2') as operador2 
    ON 
        vw.service_orders.id_service_order = records.id_service_order
    LEFT JOIN (
    SELECT 
        *
    FROM 
        vw.records WHERE records.variable = 'Intervenção em fibrocimento - operador 3') as operador3 
    ON 
        vw.service_orders.id_service_order = records.id_service_order
    LEFT JOIN (
    SELECT 
        *
    FROM 
        vw.records WHERE records.variable = 'Intervenção em fibrocimento - responsável técnico') as responsavel 
    ON 
        vw.service_orders.id_service_order = records.id_service_order
    WHERE 
    records.value_domain = 'Sim'
    AND
    vw.service_orders.date_hour_executed >= now() - interval '1 hour'
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
        console.log(asbestosdata);
        return asbestosdata;
    } catch (error) {
        console.error('Error fetching asbestos data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { asbestosdataTask };

