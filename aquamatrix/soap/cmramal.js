import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { GIS_ConsumosMesRamal } from './methods/methods.js';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

let xml;
let fatdata = [];

const getdate = async () => {
    // Get the current date
    let lastdate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    //let date = new Date();
    //date = date.setDate(date.getDate() - 1);
    // Format the date (e.g., YYYY-MM-DD)
    let formdate = `${lastdate.getFullYear()}-${(lastdate.getMonth() + 1).toString().padStart(2, '0')}-${lastdate.getDate().toString().padStart(2, '0')}`;
    //console.log(formdate);
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
                } else {
                    resolve(result);
                }
            });
        });
        xml = result['soap:Envelope']['soap:Body'][0]['GIS_ConsumosMesRamalResponse'][0]['GIS_ConsumosMesRamalResult'][0]
                    ['diffgr:diffgram'][0].NewDataSet[0].GISConsumosMesRamal;
        return xml;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const extractdata = () => {
    return new Promise((resolve, reject) => {
        let cmrData = [];
        for (let i=0; i < xml.length; i++){
            let item = xml[i];
            let hasRAMAL = Object.hasOwnProperty.call(item, 'Ramal');
            cmrData.push({
                "Ramal":hasRAMAL ? parseInt(item.Ramal[0]) : 0,
                "Classe_Consumo":xml[i].DescricaoClasseConsumo[0],
                "Dt_Fat":new Date(xml[i].AnoMes[0]),
                "Volume_Ft": parseInt(xml[i].ValorConsumo[0]),
            });    
        }
        resolve(cmrData);
    });
};

const cmrdataTask = async () => {
    try {
        const formdate = await getdate();
        //console.log(formdate);
        const method = await GIS_ConsumosMesRamal(formdate);
        const xml = await getxml(method);
        if (!xml || !xml.length) {
            console.log('Warning: Empty or invalid XML data received for date:', formdate);
            const cmrdata = 'no data';
            //console.log(fatdata);
            return cmrdata; // Ignore empty or invalid XML data
        }
        else{
            //console.log(xml.length, 'records');
            const cmrdata = await extractdata(xml);
            // Handle the extracted data
            //console.log(cmrdata);
            //console.log(cmrdata.length, 'consumos mês ramal data to insert');
            return cmrdata;
        }

    } catch (error) {
        // Handle any errors in the Promise chain
        console.error('Error in cmrdataTask:', error);
    }
};

export { cmrdataTask };
