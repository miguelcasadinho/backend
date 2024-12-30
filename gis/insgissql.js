import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import sql from 'mssql';
import { getContracts } from './psql/contracts.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const configsql = {
    user: process.env.sqlGisUser,
    password: process.env.sqlGisPassword,
    server: process.env.sqlGisHost,
    database: process.env.sqlGisAquaDatabase,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 15000
    }
};


const insertData = async (data) => {
    try {
        // Connect to the database
        const pool = await sql.connect(configsql);

        // Define the point geometry in WKT (Well-Known Text) format
        //const wktPoint = `POINT(${data.lon} ${data.lat})`;  // Format: POINT(lon lat)
        const wktPoint = `POINT(24101.62509999983 -183555.70439999923)`;  // Format: POINT(lon lat)
        // Define your insert query, using STGeomFromText to insert the geometry
        const query = `
            INSERT INTO AQUA2025 (OBJECTID, name, shape)
            VALUES (@OBJECTID, @name, geometry::STGeomFromText(@wktPoint, 3763)) 
        `;

        // Execute the query with parameters
        const result = await pool.request()
            .input('OBJECTID', sql.Int, 6)
            .input('name', sql.Text, data.name)  
            .input('wktPoint', sql.NVarChar, wktPoint)  // Pass the WKT point as a string
            .query(query);

        console.log('Rows affected:', result.rowsAffected[0]);

        // Close the connection
        await pool.close();
    } catch (err) {
        console.error('Error inserting data:', err.message);
    }
};


const inscontracts = async () => {
    try {
        const contractsdata = await getContracts();
        console.log(contractsdata);
        // Loop through contracts if it's an array
        for (const contract of contractsdata) {
            await insertData(contract);
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };

export { inscontracts };
inscontracts();

