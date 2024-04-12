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

const query = `SELECT vw.service_orders.id_service_order AS int_id,
vw.service_orders.number AS intervencao,vw.service_orders.address AS morada,vw.service_orders.dma AS zmc,vw.service_orders.symptom AS int_sintoma,workcause.work,vw.service_orders.user_execute AS responsavel,
vw.service_orders.state AS int_estado,vw.service_orders.date_hour_end - interval '1 hour' AS data_termino
FROM vw.service_orders
LEFT JOIN (SELECT vw.service_orders_cause_work.id_service_order AS id_service_order,string_agg(vw.service_orders_cause_work.work, ', ') as work,string_agg(vw.service_orders_cause_work.cause, ', ') as cause
FROM vw.service_orders_cause_work GROUP BY vw.service_orders_cause_work.id_service_order ) AS workcause ON vw.service_orders.id_service_order = workcause.id_service_order
WHERE
vw.service_orders.date_hour_executed >= now() - interval '1 hour'
AND
(workcause.work LIKE '%Instalação de torneira de suspensão inviolável%' or workcause.work LIKE '%Desativação de ramal de abastecimento%' 
or workcause.work LIKE '%Corte de Bussin%' or workcause.work LIKE '%Instalação de anilha cega%' or workcause.work LIKE '%Instalação de obturador%')
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

const unauthdataTask = async () => {
    try {
        const unauthdata = await executeQuery(query);
        console.log(unauthdata.length, "records fetched successfully");
        return unauthdata;
    } catch (error) {
        console.error('Error fetching zero GC data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { unauthdataTask };
