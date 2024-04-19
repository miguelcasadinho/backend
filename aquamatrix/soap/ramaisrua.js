import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_RamaisRua } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;
let ramruadata = [];


const getxml = async () => {
    ramruadata = [];
    try {
        const response = await axios.post(process.env.aquaHost, GIS_RamaisRua, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': GIS_RamaisRua.length
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

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_RamaisRuaResponse'][0]['GIS_RamaisRuaResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].RamaisRuaTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = () => {
    return new Promise((resolve, reject) => {
        for (let i=0; i < xml.length; i++){
            if (Object.hasOwnProperty.bind(xml[i])('PREDIO') && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE') && Object.hasOwnProperty.bind(xml[i])('ZMC') ){
                let dateString = xml[i].DTSIT[0]; 
                let year = dateString.substring(0, 4);
                let month = dateString.substring(4, 6);
                let day = dateString.substring(6, 8);
                let date = new Date(year, month - 1, day); // Month in Date object is 0-indexed (0 for January)
                let formattedDate = date.toISOString().substring(0, 10); // Get YYYY-MM-DD format
                ramruadata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPol":xml[i].NPOLICIA[0],
                    "Localidade":xml[i].LOCALIDADE[0],
                    "ZMC":xml[i].DCZMC[0],
                    "Situacao":xml[i].SITRAMAL[0],
                    "DtSituacao":new Date(formattedDate)
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('PREDIO') && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE') && !Object.hasOwnProperty.bind(xml[i])('ZMC') ){
                let dateString = xml[i].DTSIT[0]; 
                let year = dateString.substring(0, 4);
                let month = dateString.substring(4, 6);
                let day = dateString.substring(6, 8);
                let date = new Date(year, month - 1, day); // Month in Date object is 0-indexed (0 for January)
                let formattedDate = date.toISOString().substring(0, 10); // Get YYYY-MM-DD format
                ramruadata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPol":xml[i].NPOLICIA[0],
                    "Localidade":xml[i].LOCALIDADE[0],
                    "ZMC":'POR ATRIBUIR',
                    "Situacao":xml[i].SITRAMAL[0],
                    "DtSituacao":new Date(formattedDate)
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('PREDIO') && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE') && Object.hasOwnProperty.bind(xml[i])('ZMC') ){
                let dateString = xml[i].DTSIT[0]; 
                let year = dateString.substring(0, 4);
                let month = dateString.substring(4, 6);
                let day = dateString.substring(6, 8);
                let date = new Date(year, month - 1, day); // Month in Date object is 0-indexed (0 for January)
                let formattedDate = date.toISOString().substring(0, 10); // Get YYYY-MM-DD format
                ramruadata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPol":xml[i].NPOLICIA[0],
                    "Localidade":'',
                    "ZMC":xml[i].DCZMC[0],
                    "Situacao":xml[i].SITRAMAL[0],
                    "DtSituacao":new Date(formattedDate)
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('PREDIO') && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE') && !Object.hasOwnProperty.bind(xml[i])('ZMC') ){
                let dateString = xml[i].DTSIT[0]; 
                let year = dateString.substring(0, 4);
                let month = dateString.substring(4, 6);
                let day = dateString.substring(6, 8);
                let date = new Date(year, month - 1, day); // Month in Date object is 0-indexed (0 for January)
                let formattedDate = date.toISOString().substring(0, 10); // Get YYYY-MM-DD format
                ramruadata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPol":xml[i].NPOLICIA[0],
                    "Localidade":'',
                    "ZMC":'POR ATRIBUIR',
                    "Situacao":xml[i].SITRAMAL[0],
                    "DtSituacao":new Date(formattedDate)
                });
            }    
        }
        resolve(ramruadata);
    });
};

const ramruadataTask = async () => {
    try {
        const xml = await getxml();
        console.log(xml.length, 'records');
        const ramruadata = await extractdata(xml);
        // Handle the extracted data
        console.log(ramruadata.length, 'records to insert');
        return ramruadata;
    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in ramruadataTask:', error);
    }
};

export { ramruadataTask };