import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_RamaisLocais } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;

const getxml = async () => {
    try {
        const response = await axios.post(process.env.aquaHost, GIS_RamaisLocais, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': GIS_RamaisLocais.length
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

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_RamaisLocaisResponse'][0]['GIS_RamaisLocaisResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].RamaisLocaisTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractData = (xml) => {
    return new Promise((resolve, reject) => {
        try {
            let ramlocaisdata = xml.map((item) => {
                let date = null;
                if (item.DATA_LEITURA && item.DATA_LEITURA[0]) {
                    const parts = item.DATA_LEITURA[0].split('/'); // Assuming format: YYYY/MM/DD
                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                    const day = parseInt(parts[2], 10);
                    date = new Date(Date.UTC(year, month, day)).toISOString().substring(0, 10);
                }

                return {
                    Ramal: item.RAMAL ? parseInt(item.RAMAL[0], 10) : '',
                    Local: item.LOCAL ? parseInt(item.LOCAL[0], 10) : '',
                    Cliente: item.CLIENTE ? parseInt(item.CLIENTE[0], 10) : '',
                    Rua: item.RUA ? item.RUA[0] : '',
                    NPolicia: item.POLICIA ? item.POLICIA[0] : '',
                    Andar: item.ANDAR ? (typeof item.ANDAR[0] === 'object' ? '' : item.ANDAR[0]) : '',
                    Localidade: item.LOCALIDADE ? item.LOCALIDADE[0] : '',
                    Situacao: item.SITUACAO ? item.SITUACAO[0] : '',
                    Zona: item.ZONA ? parseInt(item.ZONA[0], 10) : '',
                    Area: item.AREA ? parseInt(item.AREA[0], 10) : '',
                    Sequencia: item.SEQUENCIA ? parseInt(item.SEQUENCIA[0], 10) : '',
                    DtLeitura: date || null,
                };
            });
            resolve(ramlocaisdata);
        } catch (error) {
            reject(`Error processing data: ${error.message}`);
        }
    });
};

const ramlocaisdataTask = async () => {
    try {
        const xml = await getxml();
        //console.log(xml.length, 'records');
        const ramlocaisdata = await extractData(xml);
        // Handle the extracted data
        //console.log(ramlocaisdata);
        //console.log(ramlocaisdata.length, 'records to insert');
        return ramlocaisdata;
    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in ramlocaisdataTask:', error);
    }
};

export { ramlocaisdataTask };
