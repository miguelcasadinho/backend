import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import sql from 'mssql';
import proj4 from "proj4";
import { v4 as uuidv4 } from 'uuid';
import { getContracts } from './psql/contracts.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const configsql = {
    user: process.env.sqlGisUser2,
    password: process.env.sqlGisPassword,
    server: process.env.sqlGisHost,
    database: process.env.sqlGisAquaDatabase,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 15000
    }
};

// Define the ETRS89 geographic (decimal degrees) and the ETRS89 Portugal TM06 (EPSG:3763)
const etrs89 = "+proj=longlat +ellps=GRS80 +datum=ETRS89 +no_defs";
const portugalTM06 = "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1.0 +x_0=0 +y_0=0 +ellps=GRS80 +datum=ETRS89 +units=m +no_defs";


// Transform function
async function transformCoordinates(longitude, latitude) {
    // Perform the transformation
    const [x, y] = proj4(etrs89, portugalTM06, [longitude, latitude]);
  
    // Return the result
    return { x: x.toFixed(11), y: y.toFixed(11) };
  }


  const delData = async (tableName) => {
    const validTables = ['AQUAMATRIX.DBO.AQUA2020']; // Define allowed table names
    if (!validTables.includes(tableName)) {
        throw new Error('Invalid table name');
    }

    try {
        const pool = await sql.connect(configsql);
        const query = `DELETE FROM ${tableName}`; // Safe after validation
        const result = await pool.request().query(query);
        console.log('Rows deleted:', result.rowsAffected[0]);
        await pool.close();
    } catch (err) {
        console.error('Error deleting data:', err.message);
    }
};

const insertDataBatch = async (dataArray) => {
    try {
        const pool = await sql.connect(configsql);
        const request = pool.request(); // Request for bulk insert

        // Insert data 
        for (const data of dataArray) {
            const objectId = parseInt(data.local, 10); 
            const wktPoint = `POINT(${data.lon} ${data.lat})`;
            const GC = data.sensitivity == 'GRANDE CONSUMIDOR' ? 'Sim' : 'Não';
            const REGA = data.sensitivity == 'REGA' ? 'Sim' : 'Não';
            const date_inst = new Date(data.date_inst).toISOString();
            const date_leit_fat = new Date(data.date_leit_fat).toISOString();
            const date_leit_emp = new Date(data.date_leit_emp).toISOString();
            if (isNaN(objectId)) {
                throw new Error(`Invalid OBJECTID: ${data.local}`);
            }

            // Ensure that quotes inside the query string are properly escaped
            const escapedName = data.name.replace(/'/g, " ");
            const escapedStreet = data.street.replace(/'/g, " ");
            // Add the row directly to the request for bulk insert
            await request.query(`
                INSERT INTO AQUAMATRIX.DBO.AQUA2020 (OBJECTID, Ramal, Local, Cliente, Nome, Arruamento, NPolicia, 
                Andar, Localidade, ZMC, Zona, Area_, Sequencia, Tarifario, Utilizacao, ClasseConsumo, Situacao, GC, 
                Regas, DataInstalacao, Marca, Modelo, Numero, DN, Ano, DataULF, ULF, DataULE, Media, lat, lon, Predio, 
                sensi, shape)
                VALUES (${objectId}, ${data.ramal}, ${data.local}, ${data.client}, '${escapedName}', '${escapedStreet}', 
                '${data.num_pol}', '${data.floor}', '${data.locality}', '${data.zmc}', ${data.zone}, ${data.area}, 
                ${data.sequence}, '${data.client_tariff}',  '${data.client_group}', '${data.classe}', 
                '${data.situation}', '${GC}', '${REGA}', '${date_inst}', '${data.brand}', '${data.model}', 
                '${data.device}', ${data.dn}, ${data.year}, '${date_leit_fat}', ${data.leitura_fat}, 
                '${date_leit_emp}', ${data.estimated_year}, ${data.lat}, ${data.lon}, ${data.building},
                '${data.sensitivity}', geometry::STGeomFromText('${wktPoint}', 3763))
            `);
        }

        console.log('Batch inserted:', dataArray.length);
        await pool.close();
    } catch (err) {
        console.error('Error inserting batch:', err.message);
    }
};

const transformContracts = async (contracts) => {
    //console.log(contracts);
    return await Promise.all(
        contracts.map(async (contract) => {
            const { x, y } = await transformCoordinates(Number(contract.lon), Number(contract.lat));
            return { ...contract, lon: x, lat: y };
        })
    );
};


const inscontracts = async () => {
    try {
        //await delData('AQUAMATRIX.DBO.AQUA2020');
        const contractsData = await getContracts();
        console.log(contractsData.length);
        console.log(contractsData);
        // Transform coordinates concurrently
        const transformedContracts = await transformContracts(contractsData);

        // Insert data in batches
        const batchSize = 100; // Define batch size
        for (let i = 0; i < transformedContracts.length; i += batchSize) {
            const batch = transformedContracts.slice(i, i + batchSize);
            await insertDataBatch(batch);
            console.log(`Inserted batch ${i / batchSize + 1}`);
        }
    } catch (error) {
        console.error('Error in inscontracts:', error);
    }
};

export { inscontracts };
inscontracts();

