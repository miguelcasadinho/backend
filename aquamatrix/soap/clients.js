import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../.env');
config({ path: envPath });
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_Clientes } from './methods/methods.js';

let xml;
let clientsdata = [];

const getxml = async () => {
    try {
        const response = await axios.post(process.env.aquaHost, GIS_Clientes, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': GIS_Clientes.length
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

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_ClientesResponse'][0]['GIS_ClientesResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].ClientesVigorTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = () => {
    return new Promise((resolve, reject) => {
        for (var i=0; i < xml.length; i++){
            if (Object.hasOwnProperty.bind(xml[i])('DTSIT')){
                var year = xml[i].DTSIT[0].substring(0, 4);
                var month = xml[i].DTSIT[0].substring(4, 6);
                if(month.toString().length == 1) {
                  month = '0'+month
                }
                else if (month.toString().length == 2) {
                month = month
                }
                var day = xml[i].DTSIT[0].substring(6, 8);
                if(day.toString().length == 1) {
                  day = '0'+day
                }
                else if(day.toString().length == 2){
                day = day
                }
                var date = year+'-'+month+'-'+day;
            }
            if (Object.hasOwnProperty.bind(xml[i])('CLIENTE') && Object.hasOwnProperty.bind(xml[i])('PREDIO') && Object.hasOwnProperty.bind(xml[i])('TELEMOVEL') 
                && Object.hasOwnProperty.bind(xml[i])('SENSIBILIDADE')){
                clientsdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].CODLOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "Sequencia":parseInt(xml[i].SEQUENCIA[0]),
                    "Sensibilidade":xml[i].SENSIBILIDADE[0],
                    "DcSituacao":xml[i].DCSIT[0],
                    "DtSituacao":new Date(date),
                    "Nome":xml[i].NOME[0],
                    "Tlm":parseInt(xml[i].TELEMOVEL[0])
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('CLIENTE') && Object.hasOwnProperty.bind(xml[i])('PREDIO') && Object.hasOwnProperty.bind(xml[i])('TELEMOVEL') 
                && !Object.hasOwnProperty.bind(xml[i])('SENSIBILIDADE')){
                clientsdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].CODLOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "Sequencia":parseInt(xml[i].SEQUENCIA[0]),
                    "Sensibilidade":'',
                    "DcSituacao":xml[i].DCSIT[0],
                    "DtSituacao":new Date(date),
                    "Nome":xml[i].NOME[0],
                    "Tlm":parseInt(xml[i].TELEMOVEL[0])
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('CLIENTE') && Object.hasOwnProperty.bind(xml[i])('PREDIO') && !Object.hasOwnProperty.bind(xml[i])('TELEMOVEL') 
                && Object.hasOwnProperty.bind(xml[i])('SENSIBILIDADE')){
                clientsdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].CODLOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "Sequencia":parseInt(xml[i].SEQUENCIA[0]),
                    "Sensibilidade":xml[i].SENSIBILIDADE[0],
                    "DcSituacao":xml[i].DCSIT[0],
                    "DtSituacao":new Date(date),
                    "Nome":xml[i].NOME[0],
                    "Tlm":''
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('CLIENTE') && Object.hasOwnProperty.bind(xml[i])('PREDIO') && !Object.hasOwnProperty.bind(xml[i])('TELEMOVEL') 
                && !Object.hasOwnProperty.bind(xml[i])('SENSIBILIDADE')){
                clientsdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].CODLOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Predio":parseInt(xml[i].PREDIO[0]),
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "Sequencia":parseInt(xml[i].SEQUENCIA[0]),
                    "Sensibilidade":'',
                    "DcSituacao":xml[i].DCSIT[0],
                    "DtSituacao":new Date(date),
                    "Nome":xml[i].NOME[0],
                    "Tlm":''
                });
            }
        }
        resolve(clientsdata);
    });
};

const clientsdataTask = async () => {
    try {
        const xml = await getxml();
        console.log(xml.length, 'records');
        const clientsdata = await extractdata(xml);
        // Handle the extracted data
        console.log(clientsdata.length, 'clients to insert');
        return clientsdata;
    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in clientsdataTask:', error);
    }
};

export { clientsdataTask };
