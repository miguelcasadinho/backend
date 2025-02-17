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

const query = `SELECT t1.zmc, t1.qmin, t2.qmd
from (select zmctag.zmc, qmin.flow as qmin from qmin  
left join(select zmctag.tag_id, zmctag.zmc from zmctag) as zmctag on qmin.tag_id = zmctag.tag_id where zmctag.zmc not like 'Monte Novo da Estrada') as t1,
(select zmctag.zmc, zmcvol.volume/30 as qmd FROM zmcvol
left join(select zmctag.vol_id, zmctag.zmc from zmctag) as zmctag on zmcvol.tag_id = zmctag.vol_id where date > now() - interval '45 days' )as t2
where t1.zmc = t2.zmc`;

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

const kpiqminmddataTask = async () => {
    try {
        const kpiqminmddata = await executeQuery(query);
        //console.log(kpiqminmddata);
        //console.log(kpiqminmddata.length, "records fetched successfully");
        return kpiqminmddata;
    } catch (error) {
        console.error('Error fetching qmin qmd data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { kpiqminmddataTask };

