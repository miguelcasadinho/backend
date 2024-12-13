import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { metersdataTask } from './soap/meters.js';
import { clientsdataTask } from './soap/clients.js';
import { coordsdataTask } from './soap/coords.js';
import { fatdataTask } from './soap/fat.js';
import { contradataTask } from './soap/contra.js';
import { ramruadataTask } from './soap/ramaisrua.js';
import { zmccontratosTask } from './psql/zmccontratos.js';
import { infometersTask } from './psql/infometers.js';
import { zmcinfometersTask } from './psql/zmcinfometers.js';
import { estimTask } from './psql/estimated12m.js';
import { zerofatdataTask } from './soap/fat_zeros.js';
import { ramlocaisdataTask } from './soap/ramaislocais.js';
import { cmrdataTask } from './soap/cmramal.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

// Define an async function to insert meters
const insertmetersdata = async (metersdata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < metersdata.length ; i++){
      if ( metersdata[i].DtInstalacao !== null && metersdata[i].DtLeitura !== null ){
        await client.query(`INSERT INTO meters(ramal, local, client, street, num_pol, floor, device, date_inst, dn, class, brand, model, volume, date_leit)
                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)  ON CONFLICT (device) DO UPDATE SET
                              ramal = EXCLUDED.ramal, local = EXCLUDED.local, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                              floor = EXCLUDED.floor, date_inst = EXCLUDED.date_inst, dn = EXCLUDED.dn, class = EXCLUDED.class, brand = EXCLUDED.brand, 
                              model = EXCLUDED.model, volume = EXCLUDED.volume, date_leit = EXCLUDED.date_leit`,
                          [Number(metersdata[i].Ramal), Number(metersdata[i].Local), Number(metersdata[i].Cliente), metersdata[i].Rua, metersdata[i].NPolicia, 
                          metersdata[i].Andar, metersdata[i].Contador, new Date(metersdata[i].DtInstalacao), Number(metersdata[i].Diametro), metersdata[i].Classe, 
                          metersdata[i].Marca, metersdata[i].Modelo, Number(metersdata[i].Volume), new Date(metersdata[i].DtLeitura)]);
      }
      else if ( metersdata[i].DtInstalacao !== null && metersdata[i].DtLeitura === null  ){
        await client.query(`INSERT INTO meters(ramal, local, client, street, num_pol, floor, device, date_inst, dn, class, brand, model, volume)
                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)  ON CONFLICT (device) DO UPDATE SET
                              ramal = EXCLUDED.ramal, local = EXCLUDED.local, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                              floor = EXCLUDED.floor, date_inst = EXCLUDED.date_inst, dn = EXCLUDED.dn, class = EXCLUDED.class, brand = EXCLUDED.brand, 
                              model = EXCLUDED.model, volume = EXCLUDED.volume`,
                          [Number(metersdata[i].Ramal), Number(metersdata[i].Local), Number(metersdata[i].Cliente), metersdata[i].Rua, metersdata[i].NPolicia, 
                          metersdata[i].Andar, metersdata[i].Contador, new Date(metersdata[i].DtInstalacao), Number(metersdata[i].Diametro), metersdata[i].Classe, 
                          metersdata[i].Marca, metersdata[i].Modelo, Number(metersdata[i].Volume)]);
      }
      else if ( metersdata[i].DtInstalacao === null && metersdata[i].DtLeitura !== null  ){
        await client.query(`INSERT INTO meters(ramal, local, client, street, num_pol, floor, device, dn, class, brand, model, volume, date_leit)
                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)  ON CONFLICT (device) DO UPDATE SET
                              ramal = EXCLUDED.ramal, local = EXCLUDED.local, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                              floor = EXCLUDED.floor, dn = EXCLUDED.dn, class = EXCLUDED.class, brand = EXCLUDED.brand, 
                              model = EXCLUDED.model, volume = EXCLUDED.volume, date_leit = EXCLUDED.date_leit`,
                          [Number(metersdata[i].Ramal), Number(metersdata[i].Local), Number(metersdata[i].Cliente), metersdata[i].Rua, metersdata[i].NPolicia, 
                          metersdata[i].Andar, metersdata[i].Contador, Number(metersdata[i].Diametro), metersdata[i].Classe, 
                          metersdata[i].Marca, metersdata[i].Modelo, Number(metersdata[i].Volume), new Date(metersdata[i].DtLeitura)]);
      }
      else {
        await client.query(`INSERT INTO meters(ramal, local, client, street, num_pol, floor, device, dn, class, brand, model, volume)
                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)  ON CONFLICT (device) DO UPDATE SET
                              ramal = EXCLUDED.ramal, local = EXCLUDED.local, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                              floor = EXCLUDED.floor, dn = EXCLUDED.dn, class = EXCLUDED.class, brand = EXCLUDED.brand, 
                              model = EXCLUDED.model, volume = EXCLUDED.volume`,
                          [Number(metersdata[i].Ramal), Number(metersdata[i].Local), Number(metersdata[i].Cliente), metersdata[i].Rua, metersdata[i].NPolicia, 
                          metersdata[i].Andar, metersdata[i].Contador, Number(metersdata[i].Diametro), metersdata[i].Classe, 
                          metersdata[i].Marca, metersdata[i].Modelo, Number(metersdata[i].Volume)]);
      }
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${metersdata.length} records of GIS_DadosContadores inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};



// Define an async function to insert clients
const insertclientsdata = async (clientsdata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < clientsdata.length ; i++){
      await client.query(`INSERT INTO clients(ramal, local, client, building, zone, area, sequence, sensitivity, situation, date_sit, name, phone)
                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (client) DO UPDATE SET
                          zone = EXCLUDED.zone, area = EXCLUDED.area, sequence = EXCLUDED.sequence, sensitivity = EXCLUDED.sensitivity, 
                          situation = EXCLUDED.situation, date_sit = EXCLUDED.date_sit, name = EXCLUDED.name, phone = EXCLUDED.phone`,
                          [Number(clientsdata[i].Ramal), Number(clientsdata[i].Local), Number(clientsdata[i].Cliente), Number(clientsdata[i].Predio), 
                          Number(clientsdata[i].Zona), Number(clientsdata[i].Area), Number(clientsdata[i].Sequencia), clientsdata[i].Sensibilidade, 
                          clientsdata[i].DcSituacao, new Date(clientsdata[i].DtSituacao), clientsdata[i].Nome, Number(clientsdata[i].Tlm)]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${clientsdata.length} records of GIS_Clientes inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert coords
const insertcoordsdata = async (coordsdata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (var i=0; i < coordsdata.length ; i++){
      await client.query(`INSERT INTO coord(ramal, local, lat, lon) VALUES($1, $2, $3, $4) ON CONFLICT (local) DO UPDATE SET
                          ramal = EXCLUDED.ramal, local = EXCLUDED.local, lat = EXCLUDED.lat, lon = EXCLUDED.lon`,
                          [coordsdata[i].Ramal, coordsdata[i].Local, coordsdata[i].Lat, coordsdata[i].Lon]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${coordsdata.length} records of GIS_CoordenadasPorRamal inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert fat
const insertfatdata = async (fatdata) => {
  let data = new Date;
  data.setDate(data.getDate() - 1);
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < fatdata.length ; i++){
      await client.query(`INSERT INTO dadosfaturacao(ramal, local, date, date_ini, date_fim, volume_fat) VALUES($1, $2, $3, $4, $5, $6)`,
                        [fatdata[i].Ramal, fatdata[i].Local, data, fatdata[i].Dt_Ini_Ft, fatdata[i].Dt_Fim_Ft, fatdata[i].Volume_Ft]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${fatdata.length} records of GIS_DadosFaturacao inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert zerofat
const insertzerofatdata = async (fatdata) => {
  let data = new Date;
  data.setDate(data.getDate() - 1);
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < fatdata.length ; i++){
      await client.query(`INSERT INTO dadosfaturacao(ramal, local, date, date_ini, date_fim, volume_fat) VALUES($1, $2, $3, $4, $5, $6)`,
                        [fatdata[i].Ramal, fatdata[i].Local, data, fatdata[i].Dt_Ini_Ft, fatdata[i].Dt_Fim_Ft, fatdata[i].Volume_Ft]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${fatdata.length} records of GIS_DadosFaturacao inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

//Define an async function to delete all records
const deleteAllRecords  = async (tableName) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Delete all records from the specified table
    await client.query(`DELETE FROM ${tableName}`);

    // Commit the transaction
    await client.query('COMMIT');
    
    //console.log('All records deleted successfully from', tableName);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error deleting records:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert contracts
const insertcontradata = async (contradata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    /*
    // Delete all existing records from the infocontrato table
    await deleteAllRecords('infocontrato');
    */
    // Iterate over the data and execute insert queries
    for (let i=0; i < contradata.length ; i++){
      if (contradata[i].DtInst === null){
        await client.query(`INSERT INTO infocontrato(ramal, local, client, name, street, num_pol, floor, locality, zone, area, sequence, situation, 
                            client_group, client_tariff, estimated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                            ON CONFLICT (local) DO UPDATE SET client = EXCLUDED.client, name = EXCLUDED.name, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                            floor = EXCLUDED.floor, locality = EXCLUDED.locality, area = EXCLUDED.area, sequence = EXCLUDED.sequence, situation = EXCLUDED.situation, 
                            client_group = EXCLUDED.client_group, client_tariff = EXCLUDED.client_tariff, estimated = EXCLUDED.estimated`,
                            [Number(contradata[i].Ramal), Number(contradata[i].Local), Number(contradata[i].Cliente), contradata[i].Nome, contradata[i].Rua, 
                            contradata[i].NumPolicia, contradata[i].Andar, contradata[i].Localidade, contradata[i].Zona,contradata[i].Area, contradata[i].NumSeq, 
                            contradata[i].Situacao, contradata[i].GrupoCliente, contradata[i].GrupoTarifario, Number(contradata[i].Estimativa)]);
      }
      else {
        await client.query(`INSERT INTO infocontrato(ramal, local, client, device, name, street, num_pol, floor, locality, zone, area, sequence, situation, 
                            client_group, client_tariff, date_inst, brand, year, dn, estimated)
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                            ON CONFLICT (local) DO UPDATE SET client = EXCLUDED.client, device = EXCLUDED.device, name = EXCLUDED.name, street = EXCLUDED.street, 
                            num_pol = EXCLUDED.num_pol, floor = EXCLUDED.floor, locality = EXCLUDED.locality, area = EXCLUDED.area, sequence = EXCLUDED.sequence, 
                            situation = EXCLUDED.situation, client_group = EXCLUDED.client_group, client_tariff = EXCLUDED.client_tariff, date_inst = EXCLUDED.date_inst, 
                            brand = EXCLUDED.brand, year = EXCLUDED.year, dn = EXCLUDED.dn, estimated = EXCLUDED.estimated`,
                            [Number(contradata[i].Ramal), Number(contradata[i].Local), Number(contradata[i].Cliente), contradata[i].AnoNumFabri.substring(5, ), 
                            contradata[i].Nome, contradata[i].Rua, contradata[i].NumPolicia, contradata[i].Andar, contradata[i].Localidade, contradata[i].Zona, 
                            contradata[i].Area, contradata[i].NumSeq, contradata[i].Situacao, contradata[i].GrupoCliente, contradata[i].GrupoTarifario, 
                            new Date(contradata[i].DtInst).toISOString(), contradata[i].Fabricante, contradata[i].AnoNumFabri.substring(0, 4), 
                            Number(contradata[i].Calibre), Number(contradata[i].Estimativa)]);
      }   
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${contradata.length} records of GIS_InfoContrato inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert ramrua
const insertramruadata = async (ramruadata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < ramruadata.length ; i++){
      await client.query(`INSERT INTO ramaisrua(ramal, predio, zmc, dt_sit) VALUES($1, $2, $3, $4) 
                          ON CONFLICT (ramal) DO UPDATE SET zmc = EXCLUDED.zmc, dt_sit = EXCLUDED.dt_sit`,
                          [ramruadata[i].Ramal, ramruadata[i].Predio, ramruadata[i].ZMC, ramruadata[i].DtSituacao]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${ramruadata.length} records of GIS_RamaisRua inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to zmc contracts
const insertzmccontratosdata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
      await client.query(`INSERT INTO zmccontratos(tag_id, contratos) VALUES($1, $2) ON CONFLICT (tag_id) DO UPDATE SET contratos = EXCLUDED.contratos`,
                          [data[i].zmc, data[i].contratos]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${data.length} records of contratos por zmc inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to meters data
const insertinfometersdata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
      await client.query(`INSERT INTO infometers(tag_id, age, meters, bad, tocheck) VALUES($1, $2, $3, $4, $5) 
                          ON CONFLICT (tag_id) DO UPDATE SET age = EXCLUDED.age, meters = EXCLUDED.meters, bad = EXCLUDED.bad, tocheck = EXCLUDED.tocheck`,
                          [data[i].zmc, data[i].age, data[i].meters, data[i].bad, data[i].check]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${data.length} records of meters analysis inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to zmc meters data
const insertzmcinfometersdata = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
      await client.query(`INSERT INTO infometerszmc(tag_id, age, meters, bad, tocheck) VALUES($1, $2, $3, $4, $5) 
                          ON CONFLICT (tag_id) DO UPDATE SET age = EXCLUDED.age, meters = EXCLUDED.meters, bad = EXCLUDED.bad, tocheck = EXCLUDED.tocheck`,
                          [data[i].zmc, data[i].age, data[i].meters, data[i].bad, data[i].check]);
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${data.length} records of meters analysis per zmc schema inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert estimated
const insertestimated = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;

    // Iterate over the data and execute insert queries
    let date = new Date();
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO estimated(local, date, volume) VALUES($1, $2, $3)`,
                            [data[i].local, date, Number(data[i].volume_avg)]);
      
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${data.length} records of 12 months estimated inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert ramais locais
const insertrlData = async (rldata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    // Iterate over the data and execute insert queries
    for (let i=0; i < rldata.length ; i++){
      if ( rldata[i].DtLeitura !== null ){
        await client.query(`INSERT INTO ramaislocais(ramal, local, client, street, num_pol, floor, locality, situation, zone, area, sequence, date_leit)
                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)  ON CONFLICT (local) DO UPDATE SET
                              ramal = EXCLUDED.ramal, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                              floor = EXCLUDED.floor, situation = EXCLUDED.situation, zone = EXCLUDED.zone, area = EXCLUDED.area, 
                              sequence = EXCLUDED.sequence, date_leit = EXCLUDED.date_leit`,
                          [Number(rldata[i].Ramal), Number(rldata[i].Local), Number(rldata[i].Cliente), rldata[i].Rua, rldata[i].NPolicia, 
                          rldata[i].Andar, rldata[i].Localidade, rldata[i].Situacao, Number(rldata[i].Zona), Number(rldata[i].Area), 
                          Number(rldata[i].Sequencia), new Date(rldata[i].DtLeitura)]);
      }
      else {
        await client.query(`INSERT INTO ramaislocais(ramal, local, client, street, num_pol, floor, locality, situation, zone, area, sequence)
                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)  ON CONFLICT (local) DO UPDATE SET
                              ramal = EXCLUDED.ramal, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                              floor = EXCLUDED.floor, situation = EXCLUDED.situation, zone = EXCLUDED.zone, area = EXCLUDED.area, 
                              sequence = EXCLUDED.sequence`,
                          [Number(rldata[i].Ramal), Number(rldata[i].Local), Number(rldata[i].Cliente), rldata[i].Rua, rldata[i].NPolicia, 
                          rldata[i].Andar, rldata[i].Localidade, rldata[i].Situacao, Number(rldata[i].Zona), Number(rldata[i].Area), 
                          Number(rldata[i].Sequencia)]);
      }
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${rldata.length} records of GIS_RamaisLocais inserted successfully!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// Define an async function to insert consumos mês ramal
const insertCmr = async (data) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;

    // Iterate over the data and execute insert queries
    for (let i=0; i < data.length ; i++){
        await client.query(`INSERT INTO consmesramal(ramal, classe, date, volume) VALUES($1, $2, $3, $4) ON CONFLICT (ramal, date) DO NOTHING`,
                            [data[i].Ramal, data[i].Classe_Consumo, data[i].Dt_Fat, Number(data[i].Volume_Ft)]);
      
    }
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`${formattedDate} => ${data.length} records of consumo mês ramal inserted!`);
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

const insRL = async () => {
  try {
      const rldata = await ramlocaisdataTask();
      //console.log(rldata.length);
      await insertrlData(rldata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insmeters = async () => {
  try {
      const metersdata = await metersdataTask();
      //console.log(metersdata.length);
      await insertmetersdata(metersdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insclients = async () => {
  try {
      const clientsdata = await clientsdataTask();
      //console.log(clientsdata);
      await insertclientsdata(clientsdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const inscoords = async () => {
  try {
      const coordsdata = await coordsdataTask();
      //console.log(coordsdata);
      await insertcoordsdata(coordsdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insfat = async () => {
  try {
      const fatdata = await fatdataTask();
      if (fatdata !== 'no data'){
        //console.log(fatdata);
        await insertfatdata(fatdata);
        //await pool.end();
        //console.log('Connection pool closed.');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

const inszerofat = async () => {
  try {
      const zerofatdata = await zerofatdataTask();
      if (zerofatdata !== 'no data'){
        //console.log(zerofatdata);
        await insertzerofatdata(zerofatdata);
        //await pool.end();
        //console.log('Connection pool closed.');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

const inscontra = async () => {
  try {
      await deleteAllRecords('infocontrato');
      const contradata = await contradataTask();
      //console.log(contradata);
      await insertcontradata(contradata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insramrua = async () => {
  try {
      const ramruadata = await ramruadataTask();
      //console.log(ramruadata);
      await insertramruadata(ramruadata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const inszmccontratos = async () => {
  try {
      const zmccontratosdata = await zmccontratosTask();
      //console.log(zmccontratosdata);
      await insertzmccontratosdata(zmccontratosdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insinfometers = async () => {
  try {
      const infometersdata = await infometersTask();
      //console.log(infometersdata);
      await insertinfometersdata(infometersdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const inszmcinfometers = async () => {
  try {
      const zmcinfometersdata = await zmcinfometersTask();
      //console.log(zmcinfometersdata);
      await insertzmcinfometersdata(zmcinfometersdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const insestimated = async () => {
  try {
    await deleteAllRecords('estimated');
    const estimated = await estimTask();
    //console.log(estimated);
    await insertestimated(estimated);
    //await pool.end();
    //console.log('Connection pool closed.');
} catch (error) {
    console.error('Error:', error);
}
};

const insCrm = async () => {
  try {
    const cmr = await cmrdataTask();
    //console.log(cmr);
    await insertCmr(cmr);
    //await pool.end();
    //console.log('Connection pool closed.');
  } catch (error) {
    console.error('Error:', error);
  }
};

export { insmeters, insclients, inscoords, insfat, inszerofat, inscontra, insramrua, inszmccontratos, insinfometers, inszmcinfometers, insestimated, insRL, insCrm };
