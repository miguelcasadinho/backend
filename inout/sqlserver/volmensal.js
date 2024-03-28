import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { tags } from './tags.js';
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

let volmendata = [];

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
        volmendata = [];
        for (let i=0; i < tags.length; i++){
            if (tags[i] == 146 || tags[i] == 1005) {
                const result = await executeQuery(`SELECT TOP(1) Tag_ID, 
                                                ((SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} and 
                                                Data <= DATEADD(hour, 24, cast(cast(EOMONTH(GETDATE(), -1) as date) as datetime)) ORDER BY Data DESC)
                                                - (SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} 
                                                and Data  >=  DATEADD(day, -15, GETDATE()) - DAY( DATEADD(day, -15, GETDATE()) ) + 1  ORDER BY Data ASC))
                                                - (SELECT top(1) (SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = 408 
                                                and Data <= DATEADD(hour, 24, cast(cast(EOMONTH(GETDATE(), -1) as date) as datetime)) ORDER BY Data DESC)
                                                - (SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = 408 
                                                and Data  >=  DATEADD(day, -15, GETDATE()) - DAY( DATEADD(day, -15, GETDATE()) ) + 1  ORDER BY Data ASC) As vol
                                                FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = 408) As vol
                                                FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]}`);
                volmendata.push({
                    tag_id : result[0].Tag_ID,
                    date : new Date(),
                    vol : result[0].vol
                });
            }
            else if (tags[i] == 215 || tags[i] == 1006) {
                const result = await executeQuery(`SELECT TOP(1) Tag_ID, 
                                                ((SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} 
                                                and Data <= DATEADD(hour, 24, cast(cast(EOMONTH(GETDATE(), -1) as date) as datetime)) ORDER BY Data DESC)/100)
                                                - ((SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} 
                                                and Data  >=  DATEADD(day, -15, GETDATE()) - DAY( DATEADD(day, -15, GETDATE()) ) + 1  ORDER BY Data ASC)/100) As vol
                                                FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]}`);
                volmendata.push({
                    tag_id : result[0].Tag_ID,
                    date : new Date(),
                    vol : result[0].vol
                });
            }
            else if (tags[i] == 500) {
                const result = await executeQuery(`SELECT TOP(1) Tag_ID, 
                                                ((SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} 
                                                and Data <= DATEADD(hour, 24, cast(cast(EOMONTH(GETDATE(), -1) as date) as datetime)) ORDER BY Data DESC)*10)
                                                - ((SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} 
                                                and Data  >=  DATEADD(day, -15, GETDATE()) - DAY( DATEADD(day, -15, GETDATE()) ) + 1  ORDER BY Data ASC)*10) As vol
                                                FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]}`);
                volmendata.push({
                    tag_id : result[0].Tag_ID,
                    date : new Date(),
                    vol : result[0].vol
                });
            }
            else {
                const result = await executeQuery(`SELECT TOP(1) Tag_ID,
                                                (SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} 
                                                and Data <= DATEADD(hour, 24, cast(cast(EOMONTH(GETDATE(), -1) as date) as datetime)) ORDER BY Data DESC)
                                                - (SELECT TOP(1) Valor FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]} 
                                                and Data  >=  DATEADD(day, -15, GETDATE()) - DAY( DATEADD(day, -15, GETDATE()) ) + 1  ORDER BY Data ASC) As vol
                                                FROM Go_Ready.dbo.Telegestao_data WHERE Tag_ID = ${tags[i]}`);
                volmendata.push({
                    tag_id : result[0].Tag_ID,
                    date : new Date(),
                    vol : result[0].vol
                });
            }
        }
        volmendata = volmendata.filter(item => item.length !== 0);
        return volmendata;
        } catch (err) {
        throw err;
        }
};

const volmendataTask = async () => {
    try {
      const query = await executeAllQueries();
      //console.log(volmendata);
      console.log(volmendata.length, 'records to insert');
      return volmendata;
    } catch (error) {
      // Handle any errors in the Promise chain
      console.error('Error in volmendataTask:', error);
    }
};
  
export {volmendataTask};
