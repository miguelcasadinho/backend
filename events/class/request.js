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
SELECT distinct on (vw.requests.id_request)
vw.requests.id_request AS id_request,
vw.requests.number AS requisicao,
reverse(left(reverse(vw.requests.symptom), strpos(reverse(vw.requests.symptom), '»') -2)) as "sintoma",
vw.requests.state AS estado, 
CONCAT(toponymies.street,' ',toponymies.house_number, ', ',toponymies.town) as "morada",
vw.requests.date_hour_created AS data_abertura
FROM
vw.requests
left join (
  select id_request, id_address from vw.request_address_infrastructures) as  request_address_infrastructures 
  on vw.requests.id_request = request_address_infrastructures.id_request
left join (
  select id_address, town, street, house_number, dma from vw.toponymies) as toponymies
  on request_address_infrastructures.id_address = toponymies.id_address
left join (
  select id_request as request, id_service_order from vw.request_r_service_orders) as request_r_service_orders
  on vw.requests.id_request = request_r_service_orders.request
left join (
  select id_request, state from vw.service_orders) as service_orders
  on vw.requests.id_request = service_orders.id_request  
WHERE
vw.requests.date_hour_created >= NOW() - INTERVAL '1 minute'
AND
(vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND 
(vw.requests.symptom like 'DOMA%' or vw.requests.symptom like 'DOMS%')
AND 
vw.requests.symptom not like '%Campanha de Controlo de Pragas%' 
AND
vw.requests.symptom not like '%Limpeza de sumidouros ou sarjetas%'
AND 
vw.requests.symptom not like '%Monitorização de pontos críticos%'
AND
vw.requests.symptom not like '%Limpeza de redes de drenagem%'
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

const requestdataTask = async () => {
    try {
        const requestdata = await executeQuery(query);
        if (requestdata.length > 0){
          console.log(requestdata.length, "records fetched successfully");
        };
        return requestdata;
    } catch (error) {
        console.error('Error fetching request data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { requestdataTask };
