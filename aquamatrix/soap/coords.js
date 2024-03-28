import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_CoordenadasPorRamal } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;
let coordsdata = [];

const getxml = async () => {
    try {
        const response = await axios.post(process.env.aquaHost, GIS_CoordenadasPorRamal, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': GIS_CoordenadasPorRamal.length
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

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_CoordenadasPorRamalResponse'][0]['GIS_CoordenadasPorRamalResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].CoordenadasPorRamalTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = () => {
    return new Promise((resolve, reject) => {
        for (let i=0; i < xml.length; i++){
            if (Object.hasOwnProperty.bind(xml[i])('LOCAL')){
                coordsdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Lat":Number(xml[i].COORDX[0]),
                    "Lon":Number(xml[i].COORDY[0])
                });
            }     
        }
        resolve(coordsdata);
    });
};

const coordsdataTask = async () => {
    try {
        const xml = await getxml();
        console.log(xml.length, 'records');
        const coordsdata = await extractdata(xml);
        // Handle the extracted data
        console.log(coordsdata.length, 'coords to insert');
        return coordsdata;
    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in coordsdataTask:', error);
    }
};

export { coordsdataTask };