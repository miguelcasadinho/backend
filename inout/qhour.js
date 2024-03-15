import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
import schedule from 'node-schedule';
import { tags } from './tags.js';
import pg from 'pg';
const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

import sql from 'mssql';
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

let sqlresult = [];

const executeQuery = (query) => new Promise((resolve, reject) => {
  sql.connect(configsql)
  .then(pool => {
    return pool.request().query(query);
  })
  .then(result => {
    resolve(result.recordset);
    sql.close();
  })
  .catch(err => {
    reject(err);
    sql.close();
  });
});

const executeAllQueries = async () => {
  try {
    for (var i=0; i < tags.length; i++){
      if (tags[i].tag == 488){
        const result = await executeQuery(`SELECT Tag_ID, DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)) AS date,
                                          ROUND(SUM(Valor)*10/COUNT(Valor), 2) AS flow, count(*) as n
                                          FROM Go_Ready.dbo.Telegestao_data
                                          where Data >=  DATEADD(hour, -25, GETDATE()) AND Tag_ID = ${tags[i]}
                                          GROUP BY DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)), Tag_ID
                                          ORDER BY date desc`);
        sqlresult.push(result);
      }
      else if (tags[i].tag == 285){
        const result = await executeQuery(`SELECT Tag_ID, DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)) AS date,
                                          ROUND(SUM(Valor)/10/COUNT(Valor), 2) AS flow, count(*) as n
                                          FROM Go_Ready.dbo.Telegestao_data
                                          where Data >=  DATEADD(hour, -25, GETDATE()) AND Tag_ID = ${tags[i]}
                                          GROUP BY DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)), Tag_ID
                                          ORDER BY date desc`);
        sqlresult.push(result);
      }
      else {
        const result = await executeQuery(`SELECT Tag_ID, DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)) AS date,
                                          ROUND(SUM(Valor)/COUNT(Valor), 2) AS flow, count(*) as n
                                          FROM Go_Ready.dbo.Telegestao_data
                                          where Data >=  DATEADD(hour, -25, GETDATE()) AND Tag_ID = ${tags[i]}
                                          GROUP BY DATEADD(MINUTE, 0, DATEADD(HOUR, DATEDIFF(HOUR, 0, Data), 0)), Tag_ID
                                          ORDER BY date desc`);
        sqlresult.push(result);
      }
    }
    sqlresult = sqlresult.filter(item => item.length !== 0);
    return sqlresult;
  } catch (err) {
    throw err;
  }
};

// Define an async function to insert data
const insertData = async () => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (var i=0; i < sqlresult.length ; i++){
      for (var j=1; j < sqlresult[i].length -1; j++){
        await client.query(`INSERT INTO zmcflowdis(tag_id, date, flow) VALUES($1, $2, $3) ON CONFLICT (tag_id, date) DO UPDATE SET
                  flow = EXCLUDED.flow`, [sqlresult[i][j].Tag_ID, new Date(sqlresult[i][j].date), Number(sqlresult[i][j].flow)]);
      }
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Data inserted successfully');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

const qhourTask = () => {
executeAllQueries()
.then(() => {
  console.log(sqlresult.length, ' Tags to insert');
  return insertData();
})
.catch((error) => {
    console.error('Error executing query:', error);
})
.then(() => {
  // Close the pool when done
  pool.end();
})
.catch(err => console.error('Error:', err));
};

export { qhourTask };


