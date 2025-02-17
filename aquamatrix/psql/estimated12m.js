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

const query = `SELECT 
                    local,
                    ROUND(AVG(volume_fat),2) AS volume_avg
                FROM 
                    dadosfaturacao
                WHERE 
                    date >= (CURRENT_DATE - INTERVAL '12 months')
                GROUP BY 
                    local
                ORDER BY 
                    local`;


const query2 = `SELECT 
                    local
                FROM 
                    infocontrato`;

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

const get0 = async (estimated, contracts) => {
    try {
        // Create a Set of `local` values in `estimated` for quick lookups
        const estimatedLocals = new Set(estimated.map(item => item.local));

        // Create a list of missing items with volume_avg = 0
        const missingEntries = contracts
            .filter(contract => !estimatedLocals.has(contract.local))
            .map(contract => ({ local: contract.local, volume_avg: 0 }));

        // Return the original estimated array with the new entries appended
        return estimated.concat(missingEntries);
    } catch (error) {
        console.error('Error executing get0:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


const estimTask = async () => {
    try {
        const estimdata = await executeQuery(query);
        //console.log(estimdata.length);
        const contracts = await executeQuery(query2);
        //console.log(contracts.length);
        const data = await get0(estimdata, contracts)
        //console.log(data.length);
        return data;
    } catch (error) {
        console.error('Error fetching local estimated:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
    
export { estimTask };