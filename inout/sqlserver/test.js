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
      requestTimeout: 60000
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
        const query = `
        -- Identificar a data e hora do registro mais antigo
DECLARE @DataHoraMaisAntiga DATETIME;
SELECT @DataHoraMaisAntiga = MIN(Data) FROM Go_Ready.dbo.Telegestao_data;

-- Calcular a data e hora 15 minutos após o registro mais antigo
DECLARE @DataHoraLimite DATETIME;
SET @DataHoraLimite = DATEADD(MINUTE, 15, @DataHoraMaisAntiga);
          SELECT TOP(10) 
            tag_ID, 
            Data AS Date, 
            Valor AS Value 
          FROM 
            Go_Ready.dbo.Telegestao_data
            WHERE Data = @DataHoraMaisAntiga
            and tag_ID = 4
          ORDER BY 
            Data DESC`;
  
        const result = await executeQuery(query);
        if (result.length > 0) {
          qmindata.push(result);
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
    console.log(query);
    return query;
} catch (error) {
    // Handle any errors in the Promise chain
    console.error('Error in qmindataTask:', error);
}
};

qmindataTask();