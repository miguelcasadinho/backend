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
    SELECT DISTINCT ON (volume.device)
        infocontrato.local, 
        volume.device, 
        infocontrato.name, 
        infocontrato.morada,
        volume.volume - vol72.vol72 as consumo
    FROM volume 
    LEFT JOIN (
        SELECT 
            infocontrato.local, 
            infocontrato.device, 
            infocontrato.name, 
            CONCAT(infocontrato.street,' ',infocontrato.num_pol, ' ',infocontrato.floor) as morada 
        FROM infocontrato
    ) AS infocontrato ON volume.device = infocontrato.device
    LEFT JOIN (
        SELECT clients.local, clients.sensitivity FROM clients
    ) AS clients ON infocontrato.local = clients.local
    LEFT JOIN (
        SELECT DISTINCT ON (volume.device) 
            volume.device, 
            volume.volume AS vol72
        FROM volume 
        WHERE volume.date >= now() - interval '72 hours' 
        ORDER BY volume.device, volume.date ASC
    ) AS vol72 ON volume.device = vol72.device
    WHERE 
        volume.date >= now() - interval '24 hours'
        AND clients.sensitivity = 'GRANDE CONSUMIDOR'
        AND volume.volume - vol72.vol72 <= 0
    ORDER BY volume.device, volume.date DESC
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

const zerogcdataTask = async () => {
    try {
        const zerogcdata = await executeQuery(query);
        console.log(zerogcdata.length, "records fetched successfully");
        return zerogcdata;
    } catch (error) {
        console.error('Error fetching zero GC data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { zerogcdataTask };
