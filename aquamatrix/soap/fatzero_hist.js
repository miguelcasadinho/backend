import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

let xml;
let fatdata = [];

const getxml = async (formdate) => {
    try {
        const GIS_DadosFaturacao =
            `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <GIS_ConsumosZero xmlns="http://tempuri.org/">
                <Empresa>${process.env.aquaUser}</Empresa>
                <dataInicial>${formdate}</dataInicial>
                <dataFinal>${formdate}</dataFinal>
                <!--<local></local>-->
                <!--<ramal> </ramal>-->
                <itemInicial>1</itemInicial>
                <nrItemsObter>20000</nrItemsObter>
                </GIS_ConsumosZero>
            </soap:Body>
            </soap:Envelope>`;

        const response = await axios.post(process.env.aquaHost, GIS_DadosFaturacao, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': GIS_DadosFaturacao.length
            }
        });

        const result = await new Promise((resolve, reject) => {
            parseString(response.data, (err, result) => {
                if (err) {
                    console.error('Error parsing SOAP response:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_ConsumosZeroResponse'][0]['GIS_ConsumosZeroResult'][0]
            ['diffgr:diffgram'][0].NewDataSet[0].ConsumosZeroTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = (xml) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < xml.length; i++) {
            fatdata.push({
                "Ramal":parseInt(xml[i].RAMAL[0]),
                "Local":parseInt(xml[i].LOCAL[0]),
                "Cliente":parseInt(xml[i].NR_CLIENTE[0]),
                "GrupoContador":parseInt(xml[i].GR_CONTADOR[0]),
                "Num_Contador":xml[i].NR_CONTADOR[0],
                "Dt_Ini_Ft":new Date(xml[i].DT_INI_FT[0]),
                "Dt_Fim_Ft":new Date(xml[i].DT_FIM_FT[0]),
                "Dt_Fat":new Date(xml[i].DT_EM_FCT[0]),
                "Volume_Ft": 0
            });
        }
        resolve(fatdata);
    });
};

const fatdataTask = async (formdate, actualDate) => {
    try {
        const xml = await getxml(formdate);
        if (!xml || !xml.length) {
            console.log('Warning: Empty or invalid XML data received for date:', formdate);
            return; // Ignore empty or invalid XML data
        }
        console.log(xml.length, 'records');
        const fatdata = await extractdata(xml);
        console.log(fatdata.length, 'fats to insert');
        await insertfatdata(fatdata, actualDate); // Pass actualDate to insertfatdata
        return fatdata;
    } catch (error) {
        console.error('Error in fatdataTask:', error);
        throw error;
    }
};

// Define an async function to insert fat
const insertfatdata = async (fatdata, date) => {
    const client = await pool.connect();
    try {
        // Begin a transaction
        await client.query('BEGIN');
        // Iterate over the data and execute insert queries
        for (let i = 0; i < fatdata.length; i++) {
            await client.query(`INSERT INTO dadosfaturacao(ramal, local, date, date_ini, date_fim, volume_fat) VALUES($1, $2, $3, $4, $5, $6)`,
                [fatdata[i].Ramal, fatdata[i].Local, date, fatdata[i].Dt_Ini_Ft, fatdata[i].Dt_Fim_Ft, fatdata[i].Volume_Ft]);
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

const fetchAndProcessData = async () => {
    const pageSize = 100; // Define the page size
    const totalIterations = 1; // Total number of iterations
    const totalPages = Math.ceil(totalIterations / pageSize); // Calculate total pages

    try {
        for (let page = 0; page < totalPages; page++) {
            const dates = [];
            const startIdx = page * pageSize;
            const endIdx = Math.min((page + 1) * pageSize, totalIterations);

            // Generate dates for the current page
            for (let i = startIdx; i < endIdx; i++) {
                let date = new Date();
                //date.setDate(date.getDate() - i);
                //date.setDate(date.getDate() -2);// Select other day to start the iteration
                date = new Date(2024, 9, 31);  // Months are 0-indexed, so 3 represents April
                const formdate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                dates.push({ date: formdate, actualDate: date }); // Store both formdate and actual date
            }

            // Process data for the current page
            for (const { date, actualDate } of dates) {
                fatdata = []; // Clear fatdata array before each iteration
                await fatdataTask(date, actualDate);
            }
        }

        // Process results here if needed
        console.log('All tasks completed successfully');
    } catch (error) {
        console.error('Error in fetchAndProcessData:', error);
    }
};

fetchAndProcessData();