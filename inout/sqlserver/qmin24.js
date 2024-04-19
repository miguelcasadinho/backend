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
    try {
      const pool = await sql.connect(configsql);
      const result = await pool.request().query(query);
      sql.close();
      return result.recordset;
    } catch (err) {
      sql.close();
      throw new err(`Error executing SQL query: ${err.message}`);
    }
};

const executeAllQueries = async () => {
    try {
      qmindata = [];
      for (let i=0; i < flow_tags.length; i++){
        if (flow_tags[i] == 488){
            const result = await executeQuery(`
                SELECT TOP(1) 
                    tag_ID, 
                    DATEADD(HOUR, 0, Data) AS Date, 
                    Valor * 10 AS Value 
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
                    Data ASC`);
            qmindata.push(result);
        }
        else if (flow_tags[i] == 285){
            const result = await executeQuery(`
                SELECT TOP(1) 
                    tag_ID, 
                    DATEADD(HOUR, 0, Data) AS Date, 
                    Valor / 10 AS Value 
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
                    Data ASC`);
            qmindata.push(result);
        }
        else {
            const result = await executeQuery(`
                SELECT TOP(1) 
                    tag_ID, 
                    DATEADD(HOUR, 0, Data) AS Date, 
                    Valor AS Value 
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
                    Data ASC`);
            qmindata.push(result);
        }
      }
      qmindata = qmindata.filter(item => item.length !== 0);
      return qmindata.flat();
    } catch (err) {
      throw err;
    }
  };

const qmindataTask = async () => {
try {
    const query = await executeAllQueries();
    console.log(query.length, 'records to insert');
    //console.log(query);
    return query;
} catch (error) {
    // Handle any errors in the Promise chain
    console.error('Error in qmindataTask:', error);
}
};

export {qmindataTask};


