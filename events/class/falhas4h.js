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
    SELECT vw.records.id_service_order,corte.data as int_date,corte.numero,corte.sintoma,corte.morada,vw.records.value_time as duracao  FROM vw.records
    LEFT JOIN (SELECT vw.service_orders.id_service_order,vw.service_orders.date_hour_executed AS data,vw.service_orders.number AS numero,
    vw.service_orders.symptom AS sintoma,vw.service_orders.address AS morada
    FROM vw.service_orders ) AS corte ON vw.records.id_service_order = corte.id_service_order
    WHERE 
    vw.records.variable LIKE 'Tempo interrupção abastecimento'
    AND 
    vw.records.value_time >= 240*60
    AND
    corte.data >= NOW() - INTERVAL '24 hours'
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

const falhas4hdataTask = async () => {
    try {
        const falhas4hdata = await executeQuery(query);
        console.log(falhas4hdata.length, "records fetched successfully");
        return falhas4hdata;
    } catch (error) {
        console.error('Error fetching falhas 4h data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { falhas4hdataTask };
