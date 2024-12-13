import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import fs from 'fs';
import { GIS_UpdateZmc } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });


const readCsv = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (error, data) => {
            if (error) {
                console.error('Error reading CSV file:', error);
                reject(error);
                return;
            }

            const rows = data.split('\n');
            const headers = rows[0].split(';'); // Assume the first row contains headers
            const csvfile = rows.slice(1).map(row => {
                const values = row.split(';');
                const obj = {};
                headers.forEach((header, index) => {
                    // Ensure that the values array has a value for the current index
                    obj[header.trim()] = values[index] ? values[index].trim() : null; // Set null if value is missing
                });
                return obj;
            }).filter(record => {
                // Filter out records that contain null values
                return !Object.values(record).includes(null);
            });

            resolve(csvfile);
        });
    });
};

const getxml = async (method) => {
    try {
        const response = await axios.post(process.env.aquaHost, method, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8'
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

        let xml = result['soap:Envelope']['soap:Body'][0]['GIS_UpdateZmcResponse'][0]['GIS_UpdateZmcResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].CoordTable[0].P_MSG[0];
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error;
    }
};

const updZmcTask = async () => {
    try {
        const updates = await readCsv('./tenval.csv');
        //console.log(updates)
        for (let i = 0; i < updates.length; i++) {
            const method = await GIS_UpdateZmc(updates[i].codramal, updates[i].ZMC, updates[i].XValue, updates[i].YValue);
            const xml = await getxml(method);
            if (!xml || !xml.length) {
                console.log('Warning: Empty or invalid XML data received for ramal:', updates[i].codramal);
                console.log('no data');
            } else {
                console.log('Ramal:', updates[i].codramal, '=>', xml);
            }   
        }
        console.log(updates.length, ' Ramais atualizados')
    } catch (error) {
        console.error('Error in updZmcTask:', error);
    }
};

updZmcTask();
