import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_DadosFaturacao } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;
let fatdata = [];

const getdate = async () => {
    // Get the current date
    let lastdate = new Date(new Date().setDate(new Date().getDate() - 1));
    //let date = new Date();
    //date = date.setDate(date.getDate() - 1);
    // Format the date (e.g., YYYY-MM-DD)
    let formdate = `${lastdate.getFullYear()}-${(lastdate.getMonth() + 1).toString().padStart(2, '0')}-${lastdate.getDate().toString().padStart(2, '0')}`;
    return formdate;
};

const getxml = async (method) => {
    try {
        const response = await axios.post(process.env.aquaHost, method, {
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Content-Length': method.length
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

        xml = result['soap:Envelope']['soap:Body'][0]['GIS_DadosFaturacaoResponse'][0]['GIS_DadosFaturacaoResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].DadosFaturacaoTable;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = () => {
    return new Promise((resolve, reject) => {
        fatdata = [];
        for (let i=0; i < xml.length; i++){
            fatdata.push({
                "Ramal":parseInt(xml[i].RAMAL[0]),
                "Local":parseInt(xml[i].LOCAL[0]),
                "GrupoContador":parseInt(xml[i].GR_CONTADOR[0]),
                "Num_Contador":xml[i].NR_CONTADOR[0],
                "Dt_Ini_Ft":new Date(xml[i].DT_INI_FT[0]),
                "Dt_Fim_Ft":new Date(xml[i].DT_FIM_FT[0]),
                "Volume_Ft":parseInt(xml[i].VOLUME_FT[0]),
                "Valor_Ft_Agua":parseFloat(xml[i].VALOR_FT_AGUA[0]).toFixed(2),
                "Valor_Ft_ASR":parseFloat(xml[i].VALOR_FT_ASR[0]).toFixed(2)
            });    
        }
        resolve(fatdata);
    });
};

const fatdataTask = async () => {
    try {
        const formdate = await getdate();
        //console.log(formdate);
        const method = await GIS_DadosFaturacao(formdate);
        const xml = await getxml(method);
        if (!xml || !xml.length) {
            console.log('Warning: Empty or invalid XML data received for date:', formdate);
            const fatdata = 'no data';
            //console.log(fatdata);
            return fatdata; // Ignore empty or invalid XML data
        }
        else{
            console.log(xml.length, 'records');
            const fatdata = await extractdata(xml);
            // Handle the extracted data
            console.log(fatdata.length, 'fats to insert');
            return fatdata;
        }

    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in fatdataTask:', error);
    }
};

export { fatdataTask };
