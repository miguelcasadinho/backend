import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_InfoContrato } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;
let contradata = [];

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
        for (let i=0; i < xml.length; i++){
            if (Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object') 
                && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Localidade":xml[i].LOCALIDADE[0],
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    "DtInst":new Date(xml[i].DTINST[0]),
                    "GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    "Num_Contador":xml[i].NUM_CONTADOR[0],
                    "Fabricante":xml[i].FABRICANTE[0],
                    "AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    "Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object') 
                && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":xml[i].LOCALIDADE[0],
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    "DtInst":new Date(xml[i].DTINST[0]),
                    "GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    "Num_Contador":xml[i].NUM_CONTADOR[0],
                    "Fabricante":xml[i].FABRICANTE[0],
                    "AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    "Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object') 
                && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Localidade":'',
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    "DtInst":new Date(xml[i].DTINST[0]),
                    "GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    "Num_Contador":xml[i].NUM_CONTADOR[0],
                    "Fabricante":xml[i].FABRICANTE[0],
                    "AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    "Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object') 
                && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":'',
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    "DtInst":new Date(xml[i].DTINST[0]),
                    "GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    "Num_Contador":xml[i].NUM_CONTADOR[0],
                    "Fabricante":xml[i].FABRICANTE[0],
                    "AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    "Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('DTINST') && !Object.hasOwnProperty.bind(xml[i])('ANDAR') && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":xml[i].LOCALIDADE[0],
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    "DtInst":new Date(xml[i].DTINST[0]),
                    "GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    "Num_Contador":xml[i].NUM_CONTADOR[0],
                    "Fabricante":xml[i].FABRICANTE[0],
                    "AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    "Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (Object.hasOwnProperty.bind(xml[i])('DTINST') && !Object.hasOwnProperty.bind(xml[i])('ANDAR') && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":'',
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    "DtInst":new Date(xml[i].DTINST[0]),
                    "GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    "Num_Contador":xml[i].NUM_CONTADOR[0],
                    "Fabricante":xml[i].FABRICANTE[0],
                    "AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    "Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (!Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object') 
                && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Localidade":xml[i].LOCALIDADE[0],
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    //"DtInst":new Date(xml[i].DTINST[0]),
                    //"GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    //"Num_Contador":xml[i].NUM_CONTADOR[0],
                    //"Fabricante":xml[i].FABRICANTE[0],
                    //"AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    //"Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (!Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object') 
                && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":xml[i].LOCALIDADE[0],
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    //"DtInst":new Date(xml[i].DTINST[0]),
                    //"GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    //"Num_Contador":xml[i].NUM_CONTADOR[0],
                    //"Fabricante":xml[i].FABRICANTE[0],
                    //"AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    //"Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (!Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object') 
                && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Localidade":'',
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    //"DtInst":new Date(xml[i].DTINST[0]),
                    //"GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    //"Num_Contador":xml[i].NUM_CONTADOR[0],
                    //"Fabricante":xml[i].FABRICANTE[0],
                    //"AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    //"Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (!Object.hasOwnProperty.bind(xml[i])('DTINST') && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object') 
                && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":'',
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    //"DtInst":new Date(xml[i].DTINST[0]),
                    //"GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    //"Num_Contador":xml[i].NUM_CONTADOR[0],
                    //"Fabricante":xml[i].FABRICANTE[0],
                    //"AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    //"Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (!Object.hasOwnProperty.bind(xml[i])('DTINST') && !Object.hasOwnProperty.bind(xml[i])('ANDAR') && Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":xml[i].LOCALIDADE[0],
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    //"DtInst":new Date(xml[i].DTINST[0]),
                    //"GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    //"Num_Contador":xml[i].NUM_CONTADOR[0],
                    //"Fabricante":xml[i].FABRICANTE[0],
                    //"AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    //"Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }
            else if (!Object.hasOwnProperty.bind(xml[i])('DTINST') && !Object.hasOwnProperty.bind(xml[i])('ANDAR') && !Object.hasOwnProperty.bind(xml[i])('LOCALIDADE')){
                contradata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].COD_LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Entidade":parseInt(xml[i].ENTIDADE[0]),
                    "Nome":xml[i].NOME[0],
                    "NumRua":parseInt(xml[i].NUM_RUA[0]),
                    "Rua":xml[i].RUA[0],
                    "NumPolicia":xml[i].NUM_POLICIA[0],
                    "Andar":'',
                    "Localidade":'',
                    "Freguesia":xml[i].FREGUESIA[0],
                    "CodPostal":xml[i].COD_POSTAL[0],
                    "DescPostal":xml[i].DESC_POSTAL[0],
                    "Zona":parseInt(xml[i].ZONA[0]),
                    "Area":parseInt(xml[i].AREA[0]),
                    "NumSeq":parseInt(xml[i].NUM_SEQ[0]),
                    "Situacao":xml[i].SITUACAO_CONTRATO[0],
                    "GrupoCliente":xml[i].GRUPO_CLIENTE[0],
                    "GrupoTarifario":xml[i].GRUPO_TARIFARIO[0],
                    //"DtInst":new Date(xml[i].DTINST[0]),
                    //"GrupoContador":parseInt(xml[i].GRUPO_CONTADOR[0]),
                    //"Num_Contador":xml[i].NUM_CONTADOR[0],
                    //"Fabricante":xml[i].FABRICANTE[0],
                    //"AnoNumFabri":xml[i].ANO_NUM_FABRI[0].trim(),
                    //"Calibre":parseInt(xml[i].CALIBRE[0]),
                    "Estimativa":parseInt(xml[i].ESTIMATIVA[0])
                });
            }           
        }
        resolve(contradata);
    });
};


const contradataTask = async () => {
    try {
        const xml = await getxml();
        console.log(xml.length, 'records');
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