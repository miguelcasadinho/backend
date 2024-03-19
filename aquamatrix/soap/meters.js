import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../.env');
config({ path: envPath });
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_DadosContadores } from './methods/methods.js';

let xml;
let metersdata = [];

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
        for (var i=0; i < xml.length; i++){
            if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
            && Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA') 
            && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    "Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                    "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
                }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
            && Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA') 
            && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    "Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                    "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                    });
            }        
            
            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    "Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0)
                });
            }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
            && Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
            && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    "Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0)
                });
            }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
            metersdata.push({
                "Ramal":parseInt(xml[i].RAMAL[0]),
                "Local":parseInt(xml[i].LOCAL[0]),
                "Cliente":parseInt(xml[i].CLIENTE[0]),
                "Rua":xml[i].RUA[0],
                "NPolicia":xml[i].NR_POLICIA[0],
                "Andar":xml[i].ANDAR[0],
                "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                "Contador":xml[i].NR_SERIE[0],
                "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                "Diametro":parseInt(xml[i].DIAMETRO[0]),
                //"Classe":xml[i].TARIFA[0],
                "Marca":xml[i].MARCA[0],
                "Modelo":xml[i].MODELO[0],
                "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
            });
            }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
            && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
            && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                    "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }  
            
            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0),
                    //"DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            } 
            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    "Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0),
                    //"DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }    
                    
            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
                metersdata.push({
                "Ramal":parseInt(xml[i].RAMAL[0]),
                "Local":parseInt(xml[i].LOCAL[0]),
                //"Cliente":parseInt(xml[i].CLIENTE[0]),
                "Rua":xml[i].RUA[0],
                "NPolicia":xml[i].NR_POLICIA[0],
                "Andar":xml[i].ANDAR[0],
                "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                "Contador":xml[i].NR_SERIE[0],
                "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                "Diametro":parseInt(xml[i].DIAMETRO[0]),
                "Classe":xml[i].TARIFA[0],
                "Marca":xml[i].MARCA[0],
                "Modelo":xml[i].MODELO[0],
                "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    "Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                    "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }
            
            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    "Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0)
                    //"DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                    });
            }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    "Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0)
                    //"DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }
            
            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                    "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                    "DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }
            
            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] !== 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":xml[i].ANDAR[0],
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0)
                    //"DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }

            else if (Object.hasOwnProperty.bind(xml[i])('DT_INSTALACAO') && Object.hasOwnProperty.bind(xml[i])('LOCAL') && !Object.hasOwnProperty.bind(xml[i])('CLIENTE') 
                    && !Object.hasOwnProperty.bind(xml[i])('TARIFA') && !Object.hasOwnProperty.bind(xml[i])('ULTIMA_LEITURA')
                    && (Object.hasOwnProperty.bind(xml[i])('ANDAR') && typeof xml[i].ANDAR[0] === 'object')){
                metersdata.push({
                    "Ramal":parseInt(xml[i].RAMAL[0]),
                    "Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Rua":xml[i].RUA[0],
                    "NPolicia":xml[i].NR_POLICIA[0],
                    "Andar":'',
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    "DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    "Volume":parseInt(0)
                    //"DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                });
            }

            else {
                metersdata.push({
                    //"Ramal":parseInt(xml[i].RAMAL[0]),
                    //"Local":parseInt(xml[i].LOCAL[0]),
                    //"Cliente":parseInt(xml[i].CLIENTE[0]),
                    "Grupo":parseInt(xml[i].GR_CONTADOR[0]),
                    "Numero":parseInt(xml[i].NR_CONTADOR[0]),
                    "Contador":xml[i].NR_SERIE[0],
                    //"DtInstalacao":new Date(xml[i].DT_INSTALACAO[0]),
                    "Diametro":parseInt(xml[i].DIAMETRO[0]),
                    //"Classe":xml[i].TARIFA[0],
                    "Marca":xml[i].MARCA[0],
                    "Modelo":xml[i].MODELO[0],
                    //"Volume":parseInt(xml[i].ULTIMA_LEITURA[0]),
                    //"DtLeitura":new Date(xml[i].DT_ULTIMA_LEITURA[0])
                    });
            }
        }
        resolve(metersdata);
    });
};

const metersdataTask = () => {
    return getxml()
    .then(xml => {
        console.log(xml.length, 'records');
        return extractdata(xml);
    })
    .then((metersdata) => {
        // Handle the extracted data
        console.log(metersdata.length, 'meters to insert');
        return metersdata;
    })
    .catch(error => {
        // Handle any errors in the Promise chain
        console.error('Error in metersdataTask:', error);
    });
};

export { metersdataTask };