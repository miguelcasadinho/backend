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

let qhourdata = [];

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
    qhourdata = [];
    for (let i=0; i < flow_tags.length; i++){
      if (flow_tags[i].tag == 488){
        const result = await executeQuery(`SELECT Tag_ID, DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)) AS date,
                                          ROUND(SUM(Valor)*10/COUNT(Valor), 2) AS flow, count(*) as n
                                          FROM Go_Ready.dbo.Telegestao_data
                                          where Data >=  DATEADD(hour, -25, GETDATE()) AND Tag_ID = ${flow_tags[i]}
                                          GROUP BY DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)), Tag_ID
                                          ORDER BY date desc`);
        qhourdata.push(result);
      }
      else if (flow_tags[i].tag == 285){
        const result = await executeQuery(`SELECT Tag_ID, DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)) AS date,
                                          ROUND(SUM(Valor)/10/COUNT(Valor), 2) AS flow, count(*) as n
                                          FROM Go_Ready.dbo.Telegestao_data
                                          where Data >=  DATEADD(hour, -25, GETDATE()) AND Tag_ID = ${flow_tags[i]}
                                          GROUP BY DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)), Tag_ID
                                          ORDER BY date desc`);
        qhourdata.push(result);
      }
      else {
        const result = await executeQuery(`SELECT Tag_ID, DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)) AS date,
                                          ROUND(SUM(Valor)/COUNT(Valor), 2) AS flow, count(*) as n
                                          FROM Go_Ready.dbo.Telegestao_data
                                          where Data >=  DATEADD(hour, -25, GETDATE()) AND Tag_ID = ${flow_tags[i]}
                                          GROUP BY DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)), Tag_ID
                                          ORDER BY date desc`);
        qhourdata.push(result);
      }
    }
    qhourdata = qhourdata.filter(item => item.length !== 0);
    return qhourdata;
  } catch (err) {
    throw err;
  }
};

const qhourdataTask = async () => {
  try {
    const query = await executeAllQueries();
    //console.log(qhourdata.length, 'records to insert');
    return qhourdata;
  } catch (error) {
    // Handle any errors in the Promise chain
    console.error('Error in qhourdataTask:', error);
  }
};

export {qhourdataTask};
