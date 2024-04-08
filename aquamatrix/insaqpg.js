import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';
import { metersdataTask } from './soap/meters.js';
import { clientsdataTask } from './soap/clients.js';
import { coordsdataTask } from './soap/coords.js';
import { fatdataTask } from './soap/fat.js';
import { contradataTask } from './soap/contra.js'
import { ramruadataTask } from './soap/ramaisrua.js'

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
      // Iterate over the data and execute insert queries
      for (var i=0; i < metersdata.length ; i++){
        if ( Object.hasOwnProperty.bind(metersdata[i])('DtInstalacao') && Object.hasOwnProperty.bind(metersdata[i])('DtLeitura') ){
          await client.query(`INSERT INTO meters(ramal, local, client, street, num_pol, floor, device, date_inst, dn, class, brand, model, volume, date_leit)
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)  ON CONFLICT (device) DO UPDATE SET
                                ramal = EXCLUDED.ramal, local = EXCLUDED.local, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                                floor = EXCLUDED.floor, date_inst = EXCLUDED.date_inst, dn = EXCLUDED.dn, class = EXCLUDED.class, brand = EXCLUDED.brand, 
                                model = EXCLUDED.model, volume = EXCLUDED.volume, date_leit = EXCLUDED.date_leit`,
                            [Number(metersdata[i].Ramal), Number(metersdata[i].Local), Number(metersdata[i].Cliente), metersdata[i].Rua, metersdata[i].NPolicia, 
                            metersdata[i].Andar, metersdata[i].Contador, new Date(metersdata[i].DtInstalacao), Number(metersdata[i].Diametro), metersdata[i].Classe, 
                            metersdata[i].Marca, metersdata[i].Modelo, Number(metersdata[i].Volume), new Date(metersdata[i].DtLeitura)]);
        }
        else if ( Object.hasOwnProperty.bind(metersdata[i])('DtInstalacao') && !Object.hasOwnProperty.bind(metersdata[i])('DtLeitura') ){
          await client.query(`INSERT INTO meters(ramal, local, client, street, num_pol, floor, device, date_inst, dn, class, brand, model, volume)
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)  ON CONFLICT (device) DO UPDATE SET
                                ramal = EXCLUDED.ramal, local = EXCLUDED.local, client = EXCLUDED.client, street = EXCLUDED.street, num_pol = EXCLUDED.num_pol,
                                floor = EXCLUDED.floor, date_inst = EXCLUDED.date_inst, dn = EXCLUDED.dn, class = EXCLUDED.class, brand = EXCLUDED.brand, 
                                model = EXCLUDED.model, volume = EXCLUDED.volume`,
                            [Number(metersdata[i].Ramal), Number(metersdata[i].Local), Number(metersdata[i].Cliente), metersdata[i].Rua, metersdata[i].NPolicia, 
                            metersdata[i].Andar, metersdata[i].Contador, new Date(metersdata[i].DtInstalacao), Number(metersdata[i].Diametro), metersdata[i].Classe, 
                            metersdata[i].Marca, metersdata[i].Modelo, Number(metersdata[i].Volume)]);
        }
        else if ( !Object.hasOwnProperty.bind(metersdata[i])('DtInstalacao') && Object.hasOwnProperty.bind(metersdata[i])('DtLeitura') ){
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

// Define an async function to insert clients
const insertclientsdata = async (clientsdata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (var i=0; i < clientsdata.length ; i++){
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

// Define an async function to insert coords
const insertcoordsdata = async (coordsdata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (var i=0; i < coordsdata.length ; i++){
      await client.query(`INSERT INTO coord(ramal, local, lat, lon) VALUES($1, $2, $3, $4) ON CONFLICT (local) DO UPDATE SET
                          ramal = EXCLUDED.ramal, local = EXCLUDED.local, lat = EXCLUDED.lat, lon = EXCLUDED.lon`,
                          [coordsdata[i].Ramal, coordsdata[i].Local, coordsdata[i].Lat, coordsdata[i].Lon]);
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

// Define an async function to insert fat
const insertfatdata = async (fatdata) => {
  let data = new Date;
  data.setDate(data.getDate() - 1);
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (var i=0; i < fatdata.length ; i++){
      await client.query(`INSERT INTO dadosfaturacao(ramal, local, date, date_ini, date_fim, volume_fat) VALUES($1, $2, $3, $4, $5, $6)`,
                        [fatdata[i].Ramal, fatdata[i].Local, data, fatdata[i].Dt_Ini_Ft, fatdata[i].Dt_Fim_Ft, fatdata[i].Volume_Ft]);
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

// Define an async function to delete contracts
const deleteAllRecords  = async (tableName) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Delete all records from the specified table
    await client.query(`DELETE FROM ${tableName}`);

    // Commit the transaction
    await client.query('COMMIT');
    
    console.log('All records deleted successfully from', tableName);
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
    // Delete all existing records from the infocontrato table
    await deleteAllRecords('infocontrato');
    // Iterate over the data and execute insert queries
    for (var i=0; i < contradata.length ; i++){
      if ( !Object.hasOwnProperty.bind(contradata[i])('DtInst') ){
        await client.query(`INSERT INTO infocontrato(ramal, local, client, name, street, num_pol, floor, locality, zone, area, sequence, situation, 
                            client_group, client_tariff, estimated)
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                            [Number(contradata[i].Ramal), Number(contradata[i].Local), Number(contradata[i].Cliente), contradata[i].Nome, contradata[i].Rua, 
                            contradata[i].NumPolicia, contradata[i].Andar, contradata[i].Localidade, contradata[i].Zona,contradata[i].Area, contradata[i].NumSeq, 
                            contradata[i].Situacao, contradata[i].GrupoCliente, contradata[i].GrupoTarifario, Number(contradata[i].Estimativa)]);
      }
      else {
        await client.query(`INSERT INTO infocontrato(ramal, local, client, device, name, street, num_pol, floor, locality, zone, area, sequence, situation, 
                            client_group, client_tariff, date_inst, brand, year, dn, estimated)
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
                            [Number(contradata[i].Ramal), Number(contradata[i].Local), Number(contradata[i].Cliente), contradata[i].AnoNumFabri.substring(5, ), 
                            contradata[i].Nome, contradata[i].Rua, contradata[i].NumPolicia, contradata[i].Andar, contradata[i].Localidade, contradata[i].Zona, 
                            contradata[i].Area, contradata[i].NumSeq, contradata[i].Situacao, contradata[i].GrupoCliente, contradata[i].GrupoTarifario, 
                            new Date(contradata[i].DtInst).toISOString(), contradata[i].Fabricante, contradata[i].AnoNumFabri.substring(0, 4), 
                            Number(contradata[i].Calibre), Number(contradata[i].Estimativa)]);
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

// Define an async function to insert fat
const insertramruadata = async (ramruadata) => {
  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');
    // Iterate over the data and execute insert queries
    for (var i=0; i < ramruadata.length ; i++){
      await client.query(`INSERT INTO ramaisrua(ramal, predio, zmc, dt_sit) VALUES($1, $2, $3, $4) 
                          ON CONFLICT (ramal) DO UPDATE SET zmc = EXCLUDED.zmc, dt_sit = EXCLUDED.dt_sit`,
                          [ramruadata[i].Ramal, ramruadata[i].Predio, ramruadata[i].ZMC, ramruadata[i].DtSituacao]);
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

const insmeters = async () => {
  try {
      const metersdata = await metersdataTask();
      //console.log(metersdata);
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
      //console.log(fatdata);
      await insertfatdata(fatdata);
      //await pool.end();
      //console.log('Connection pool closed.');
  } catch (error) {
      console.error('Error:', error);
  }
};

const inscontra = async () => {
  try {
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

export { insmeters, insclients, inscoords, insfat, inscontra, insramrua };