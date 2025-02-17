import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

const query = `
SELECT DISTINCT ON (ic.local)
    ic.ramal, ic.local, cl.building, ic.client, cl.sensitivity, ic.name, ic.street, ic.num_pol, ic.floor, ic.locality, 
    cl.phone, rr.zmc, ic.zone, ic.area, ic.sequence, ic.situation, ic.client_group, ic.client_tariff, cmr.classe, 
    ic.date_inst, ic.device, ic.brand, mt.model, ic.year, ic.dn, rl.date_leit as date_leit_emp, mt.date_leit as date_leit_fat, 
    mt.volume as leitura_fat, ic.estimated, et.volume as estimated_year, cd.lat, cd.lon
FROM 
    infocontrato AS ic
LEFT JOIN ramaisrua AS rr ON ic.ramal = rr.ramal
LEFT JOIN (SELECT DISTINCT ON (local) * from clients ORDER BY local, date_sit DESC) AS cl ON ic.local = cl.local
LEFT JOIN ramaislocais AS rl ON ic.local = rl.local
LEFT JOIN consmesramal AS cmr ON ic.ramal = cmr.ramal
LEFT JOIN (SELECT DISTINCT ON (local) * from meters ORDER BY local, date_leit DESC) AS mt ON ic.local = mt.local
LEFT JOIN coord AS cd ON ic.local = cd.local
LEFT JOIN estimated AS et ON ic.local = et.local
--where et.volume > 1000
--limit 1
where ic.date_inst > now() -interval '1 month'
 ;
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

const getContracts = async () => {
    try {
        const contractsdata = await executeQuery(query);
        //console.log(contractsdata);
        return contractsdata;
    } catch (error) {
        console.error('Error fetching infocontrato data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { getContracts };