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
    SELECT t1.ZMC, t1.Condutas_length, t2.Ramais_number, t2.Ramais_length, t2.Ramais_length_med
    FROM (select ZMC, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Condutas_length
        FROM aTubagens WHERE Proprietario = 'EMAS' group by ZMC) as t1, 
    (SELECT ZMC, COUNT(Shape.STLength()) as Ramais_number, CAST(SUM(Shape.STLength())/1000 AS DECIMAL(6,3)) as Ramais_length,
    CAST(SUM(Shape.STLength()) / COUNT(Shape.STLength())AS DECIMAL(5,2)) AS Ramais_length_med FROM InfraSIG.dbo.aRamais
    WHERE Proprietario = 'EMAS' group by ZMC) as t2 WHERE t1.ZMC = t2.ZMC ORDER BY ZMC`;

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

const tubramdataTask = async () => {
    try {
      const result = await executeQuery();
      //console.log(result.length, 'records retrieved');
      return result;
    } catch (error) {
      console.error('Error in tubramdataTask:', error);
    }
};

export { tubramdataTask };
