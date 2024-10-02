import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_DadosContadores } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;

const getxml = async () => {
    try {
        const response = await axios.post(process.env.aquaHost, GIS_DadosContadores, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': GIS_DadosContadores.length
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

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_DadosContadoresResponse'][0]['GIS_DadosContadoresResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].DadosContadoresTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = () => {
    return new Promise((resolve, reject) => {
        let metersdata = [];
        for (let i=0; i < xml.length; i++){
            let item = xml[i];
            let hasRAMAL = Object.hasOwnProperty.call(item, 'ANDAR');
            let hasRUA = Object.hasOwnProperty.call(item, 'RUA');
            let hasNR_POLICIA = Object.hasOwnProperty.call(item, 'NR_POLICIA');
            let hasANDAR = Object.hasOwnProperty.call(item, 'ANDAR');
            let hasLOCAL = Object.hasOwnProperty.call(item, 'LOCAL');
            let hasCLIENTE = Object.hasOwnProperty.call(item, 'CLIENTE');
            let hasTARIFA= Object.hasOwnProperty.call(item, 'TARIFA');
            let hasULTIMA_LEITURA = Object.hasOwnProperty.call(item, 'ULTIMA_LEITURA');
            let hasDTINST = Object.hasOwnProperty.call(item, 'DTINST');

            metersdata.push({
                "Ramal":hasRAMAL ? parseInt(item.RAMAL[0]) : '',
                "Local":hasLOCAL ? parseInt(item.LOCAL[0]) : '',
                "Cliente":hasCLIENTE ? parseInt(item.CLIENTE[0]) : '',
                "Rua":hasRUA ? item.RUA[0] : '',
                "NPolicia":hasNR_POLICIA ? item.NR_POLICIA[0] : '',
                "Andar":hasANDAR ? (typeof item.ANDAR[0] === 'object' ? '' : item.ANDAR[0]) : '',
                "Grupo":parseInt(item.GR_CONTADOR[0]),
                "Numero":parseInt(item.NR_CONTADOR[0]),
                "Contador":item.NR_SERIE[0],
                "DtInstalacao":hasDTINST ? new Date(item.DTINST[0]) : null,
                "Diametro":parseInt(item.DIAMETRO[0]),
                "Classe":hasTARIFA ? item.TARIFA[0] : '',
                "Marca":item.MARCA[0],
                "Modelo":item.MODELO[0],
                "Volume":hasULTIMA_LEITURA ? parseInt(item.ULTIMA_LEITURA[0]) : '',
                "DtLeitura":hasULTIMA_LEITURA ? new Date(item.DT_ULTIMA_LEITURA[0]) : null
            });          
        }
        resolve(metersdata);
    });
};

const metersdataTask = async () => {
    try {
        const xml = await getxml();
        //console.log(xml.length, 'records');
        const metersdata = await extractdata(xml);
        // Handle the extracted data
        //console.log(metersdata.length, 'meters to insert');
        return metersdata;
    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in metersdataTask:', error);
    }
};

export { metersdataTask };
