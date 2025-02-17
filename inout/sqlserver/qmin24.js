import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { flow_tags } from './tags.js';
import sql from 'mssql';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const configsql = {
    user: process.env.sqlInoutUser,
    password: process.env.sqlInoutPassword,
    server: process.env.sqlInoutHost,
    database: process.env.sqlInoutDatabase,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 15000
    }
};

let qmindata = [];

const executeQuery = async (query) => {
    let pool;
    try {
      pool = await sql.connect(configsql);
      const result = await pool.request().query(query);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error executing SQL query: ${err.message}`);
    } finally {
      if (pool) {
        pool.close();
      }
    }
  };

  const executeAllQueries = async () => {
    try {
      qmindata = [];
      for (let i = 0; i < flow_tags.length; i++) {
        let multiplier = 1;
        if (flow_tags[i] === 488) {
          multiplier = 10;
        } else if (flow_tags[i] === 285) {
          multiplier = 0.1;
        }
  
        const query = `
          SELECT TOP(1) 
            tag_ID, 
            DATEADD(HOUR, 0, Data) AS Date, 
            Valor * ${multiplier} AS Value 
          FROM 
            Go_Ready.dbo.Telegestao_data 
          WHERE 
            Tag_ID = ${flow_tags[i]} 
            AND Data >= DATEADD(hour, -9, GETDATE()) 
            AND Valor = (
              SELECT MIN(Valor) 
              FROM Go_Ready.dbo.Telegestao_data 
              WHERE Data >= DATEADD(hour, -9, GETDATE()) 
              AND Tag_ID = ${flow_tags[i]}
            ) 
          ORDER BY 
            Data ASC`;
  
        const result = await executeQuery(query);
        if (result.length > 0) {
          qmindata.push(result);
        }
      }
  
      return qmindata.flat();
    } catch (err) {
      throw err;
    }
  };

const qmindataTask = async () => {
try {
    const query = await executeAllQueries();
    //console.log(query.length, 'records to insert');
    //console.log(query);
    return query;
} catch (error) {
    // Handle any errors in the Promise chain
    console.error('Error in qmindataTask:', error);
}
};

export {qmindataTask};

//qmindataTask();