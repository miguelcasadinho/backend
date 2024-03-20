import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
import pg from 'pg';
import { metersdataTask } from './soap/meters.js';
import { clientsdataTask } from './soap/clients.js';
import { coordsdataTask } from './soap/coords.js';


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

const insmeters = () => {
    metersdataTask()
    .then((metersdata) => {
        //console.log(metersdata);
        return insertmetersdata(metersdata);
    })
    .then(() => {
        // Close the pool when done
        return pool.end(); // Return the promise returned by pool.end()
    })
    .then(() => {
        console.log('Connection pool closed.');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};

const insclients = () => {
  clientsdataTask()
  .then((clientsdata) => {
      //console.log(clientsdata);
      return insertclientsdata(clientsdata);
  })
  .then(() => {
      // Close the pool when done
      return pool.end(); // Return the promise returned by pool.end()
  })
  .then(() => {
      console.log('Connection pool closed.');
  })
  .catch((error) => {
      console.error('Error:', error);
  });
};

const inscoords = () => {
  coordsdataTask()
  .then((coordsdata) => {
      //console.log(coordsdata);
      return insertcoordsdata(coordsdata);
  })
  .then(() => {
      // Close the pool when done
      return pool.end(); // Return the promise returned by pool.end()
  })
  .then(() => {
      console.log('Connection pool closed.');
  })
  .catch((error) => {
      console.error('Error:', error);
  });
};

export { insmeters, insclients, inscoords };