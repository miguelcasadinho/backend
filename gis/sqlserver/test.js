import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import sql from 'mssql';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const configsql = {
    user: process.env.sqlGisUser,
    password: process.env.sqlGisPassword,
    server: process.env.sqlGisHost,
    database: process.env.sqlGisDatabase,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 15000
    }
};

const pool = new sql.ConnectionPool(configsql);

const query = `
    SELECT *
    FROM InfraSIG.DBO.pColectores 
    WHERE Localizacao IS NULL`;

const executeQuery = async () => {
  let tubramdata = [];
  try {
      await pool.connect();
      const result = await pool.request().query(query);
      tubramdata = result.recordset;
      return tubramdata;
  } catch (err) {
      throw new Error(`Error executing SQL query: ${err.message}`);
  } finally {
      pool.close();
  }
};

const testTask = async () => {
    try {
      const result = await executeQuery();
      console.log(result.length);
      return result;
    } catch (error) {
      console.error('Error in tubramdataTask:', error);
    }
};

testTask();