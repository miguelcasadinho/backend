import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { createClient } from '@google/maps';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlNaviaHost,
    port: process.env.psqlNaviaPort,
    user: process.env.psqlNaviaUser,
    password: process.env.psqlNaviaPassword,
    database: process.env.psqlNaviaDatabase
});

const googleMapsClient = createClient({
    key: process.env.gmailGeocoder // Replace with your actual API key
  });

const query = `SELECT distinct on (vw.requests.id_request)
vw.requests.id_request AS id_request,
vw.requests.number AS requisicao,
vw.requests.symptom AS sintoma,
vw.requests.state AS estado,
CONCAT(toponymies.street,' ',toponymies.house_number) as "Morada",
toponymies.town as "Localidade",
toponymies.dma as "ZMC",
--request_r_service_orders.request,
--request_r_service_orders.id_service_order,
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
WHERE
vw.requests .date_hour_created >= NOW() - INTERVAL '180 DAYS'
AND
(vw.requests.state = 'Requisitada' or vw.requests.state = 'Requisitada com análise')
AND 
vw.requests.symptom like 'DOMA » Abastecimento » Fugas de água%'
AND
request_r_service_orders.request is NULL
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

// Geocode an address
const geocodeAddress = async (address) => {
try {
    const response = await new Promise((resolve, reject) => {
    googleMapsClient.geocode({ address }, (err, response) => {
        if (!err) {
        resolve(response);
        } else {
        reject(err);
        }
    });
    });
    //console.log(response.json.results[0].geometry.location);
    return response.json.results[0].geometry.location;
} catch (error) {
    throw new Error(error.message);
}
};

// Geocode all addresses
const geocodeAddresses = async (addresses) => {
    let results = [];
    for (const address of addresses) {
        const { requisicao, sintoma, estado, Morada, Localidade, ZMC, data_abertura } = address;
        const str = sintoma;
        const parts = str.split('Fugas de água » '); // Split the string
        const rightPart = parts[1]; 
        try {
            const response = await geocodeAddress(`PORTUGAL BEJA ${Localidade} ${Morada}`);
            results.push({Data:data_abertura, Requisicao:requisicao, Sintoma:rightPart, Estado:estado, Morada:Morada, Localidade:Localidade, ZMC:ZMC, Lat:response.lat, Lon:response.lng});
        } catch (error) {
            console.log(error.message); // Log the error for the specific address
            results.push(null); // Push null to results to indicate failure for this address
        }
    }
    //console.log(results);
    return results;
};

const georeqTask = async () => {
    try {
        const georeqdata = await executeQuery(query);
        //console.log(georeqdata.length, "records fetched successfully");
        //console.log(georeqdata);
        const geodata = await geocodeAddresses(georeqdata);
        //console.log(geodata);
        return geodata;
    } catch (error) {
        console.error('Error fetching requests, service orders data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { georeqTask };
