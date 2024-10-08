import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_InfoContrato } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;

const getxml = async () => {
    try {
        const response = await axios.post(process.env.aquaHost, GIS_InfoContrato, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': GIS_InfoContrato.length
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

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_InfoContratoResponse'][0]['GIS_InfoContratoResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].InfoContratoTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = () => {
    return new Promise((resolve, reject) => {
        let contradata = [];
        for (let i=0; i < xml.length; i++){
            let item = xml[i];
            let hasNOME = Object.hasOwnProperty.call(item, 'NOME');
            let hasANDAR = Object.hasOwnProperty.call(item, 'ANDAR');
            let hasLOCALIDADE = Object.hasOwnProperty.call(item, 'LOCALIDADE');
            let hasFREGUESIA = Object.hasOwnProperty.call(item, 'FREGUESIA');
            let hasDTINST = Object.hasOwnProperty.call(item, 'DTINST');

            contradata.push({
                "Ramal":parseInt(item.RAMAL[0]),
                "Local":parseInt(item.COD_LOCAL[0]),
                "Cliente":parseInt(item.CLIENTE[0]),
                "Entidade":parseInt(item.ENTIDADE[0]),
                "Nome":hasNOME ? item.NOME[0] : '',
                "NumRua":parseInt(item.NUM_RUA[0]),
                "Rua":item.RUA[0],
                "NumPolicia":item.NUM_POLICIA[0],
                "Andar":hasANDAR ? (typeof item.ANDAR[0] === 'object' ? '' : item.ANDAR[0]) : '',
                "Localidade":hasLOCALIDADE ? item.LOCALIDADE[0] : '',
                "Freguesia":hasFREGUESIA ? item.FREGUESIA[0] : '',
                "CodPostal":item.COD_POSTAL[0],
                "DescPostal":item.DESC_POSTAL[0],
                "Zona":parseInt(item.ZONA[0]),
                "Area":parseInt(item.AREA[0]),
                "NumSeq":parseInt(item.NUM_SEQ[0]),
                "Situacao":item.SITUACAO_CONTRATO[0],
                "GrupoCliente":item.GRUPO_CLIENTE[0],
                "GrupoTarifario":item.GRUPO_TARIFARIO[0],
                "DtInst":hasDTINST ? new Date(item.DTINST[0]) : null,
                "GrupoContador":hasDTINST ? parseInt(item.GRUPO_CONTADOR[0]) : null,
                "Num_Contador":hasDTINST ? item.NUM_CONTADOR[0] : null,
                "Fabricante":hasDTINST ? item.FABRICANTE[0] : null,
                "AnoNumFabri":hasDTINST ? item.ANO_NUM_FABRI[0].trim() : null,
                "Calibre":hasDTINST ?parseInt(item.CALIBRE[0]) : 0,
                "Estimativa":parseInt(item.ESTIMATIVA[0])
            });  
        }
        resolve(contradata);
    });
};


const contradataTask = async () => {
    try {
        const xml = await getxml();
        //console.log(xml.length, 'records');
        const contradata = await extractdata(xml);
        // Handle the extracted data
        console.log(contradata.length, 'contrats to insert');
        return contradata;
    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in contradataTask:', error);
    }
};

export { contradataTask };
contradataTask();