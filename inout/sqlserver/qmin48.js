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

let qmin48data = [];

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
      await pool.close();
    }
  }
};

const buildQuery = (tagId, multiplier) => `
  SELECT TOP(1) 
    tag_ID, 
    DATEADD(HOUR, 0, Data) AS Date, 
    Valor * ${multiplier} AS Value 
  FROM 
    Go_Ready.dbo.Telegestao_data 
  WHERE 
    Tag_ID = ${tagId} 
    AND Data >= DATEADD(hour, -33, GETDATE()) AND Data < DATEADD(hour, -24, GETDATE())
    AND Valor = (
      SELECT MIN(Valor) 
      FROM Go_Ready.dbo.Telegestao_data 
      WHERE Data >= DATEADD(hour, -33, GETDATE()) AND Data < DATEADD(hour, -24, GETDATE())
      AND Tag_ID = ${tagId}
    ) 
  ORDER BY 
    Data ASC`;

const executeAllQueries = async () => {
  try {
    qmin48data = [];
    for (const tagId of flow_tags) {
      let multiplier = 1;
      if (tagId === 488) multiplier = 10;
      else if (tagId === 285) multiplier = 0.1;

      const query = buildQuery(tagId, multiplier);
      const result = await executeQuery(query);
      if (result.length > 0) {
        qmin48data.push(result);
      }
    }
    return qmin48data.flat();
  } catch (err) {
    throw err;
  }
};

const qmin48dataTask = async () => {
  try {
    const query = await executeAllQueries();
    //console.log(query.length, 'records to insert');
    console.log(query);
    return query;
  } catch (error) {
    // Handle any errors in the Promise chain
    console.error('Error in qmin48dataTask:', error);
  }
};

export { qmin48dataTask };
qmin48dataTask();
