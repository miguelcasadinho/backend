import { axiomaDecoder } from './decoders/axioma.js';
import { sagemDecoder } from './decoders/sagem.js';
import { gladiatorDecoder } from './decoders/gladiator.js';
import { arrowDecoder } from './decoders/maddalena.js';
import { janzLoraDecoder } from './decoders/janz_lora.js';
import { janz2Decoder } from './decoders/janz2.js';
import { diehlDecoder } from './decoders/diehl.js';
import { nkeDecoder } from './decoders/nke.js';
import { xtrDecoder } from './decoders/xtr.js';
import { pslbDecoder } from './decoders/ps-lb.js';
import { ldds75Decoder} from  './decoders/ldds75.js';
import { sensecapDecoder} from  './decoders/sensecap.js';
import { xlogicDecoder } from './decoders/xlogic.js';
import { arquiledDecoder } from './decoders/arquiled.js';
import { insertPg } from './ins_pg.js';
import express from 'express';
import bodyParser from 'body-parser';

const port = 2000;
const path = '/chirp';
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST endpoint to handle messages
app.post(path, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var requestAsJson = JSON.stringify(req.body);
    var objectjson = JSON.parse(requestAsJson);
    //console.log(objectjson);
    var appID = objectjson.applicationID;
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    switch (appID) {
        case '34':
            let axioma_decoded = axiomaDecoder(objectjson);
            if (typeof axioma_decoded !== 'undefined'){
                //console.log(axioma_decoded);
                insertPg(axiomaDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');      
            break;
        case '39':
            let nke_decoded = nkeDecoder(objectjson);
            if (typeof nke_decoded !== 'undefined'){
                //console.log(nke_decoded);
                insertPg(nkeDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');      
            break;
        case '42':
            let gladiator_decoded = gladiatorDecoder(objectjson);
            if (typeof gladiator_decoded !== 'undefined'){
                //console.log(gladiator_decoded);
                insertPg(gladiatorDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');      
            break;
        case '45':
            let sagem_decoded = sagemDecoder(objectjson);
            if (typeof sagem_decoded !== 'undefined'){
                //console.log(sagem_decoded);
                insertPg(sagemDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');      
            break;
        case '80':
            let xtr_decoded = xtrDecoder(objectjson);
            if (typeof xtr_decoded !== 'undefined'){
                //console.log(xtr_decoded);
                insertPg(xtrDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');      
            break;
        case '81':
            let arrow_decoded = arrowDecoder(objectjson);
            if (typeof arrow_decoded !== 'undefined'){
                //console.log(arrow_decoded);
                insertPg(arrowDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');        
            break;
        case '82':
            let janz2_decoded = janz2Decoder(objectjson);
            if (typeof janz2_decoded !== 'undefined'){
                //console.log(janz2_decoded);
                insertPg(janz2Decoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');    
            break;
        case '83':
            let diehl_decoded = diehlDecoder(objectjson);
            if (typeof diehl_decoded !== 'undefined'){
                //console.log(diehl_decoded);
                insertPg(diehlDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');    
            break;
        case '84':
            let sensecap_decoded = sensecapDecoder(objectjson);
            if (typeof sensecap_decoded !== 'undefined'){
                //console.log(pslb_decoded);
                insertPg(sensecapDecoder(objectjson));   
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');
            break;
        case '85':
            let pslb_decoded = pslbDecoder(objectjson);
            if (typeof pslb_decoded !== 'undefined'){
                //console.log(pslb_decoded);
                insertPg(pslbDecoder(objectjson));   
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');
            break;
        case '86':
            let ldds75_decoded = ldds75Decoder(objectjson);
            if (typeof ldds75_decoded !== 'undefined'){
                //console.log(ldds75_decoded);
                insertPg(ldds75Decoder(objectjson));   
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');
            break;           
        case '119':
            let janzLora_decoded = janzLoraDecoder(objectjson);
            if (typeof janzLora_decoded !== 'undefined') {
                //console.log(janzLora_decoded);
                insertPg(janzLoraDecoder(objectjson));  
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }  
            res.send('Data received successfully!');
            break;
        case '152':
            let xlogic_decoded = xlogicDecoder(objectjson);
            if (typeof xlogic_decoded !== 'undefined'){
                //console.log(xlogic_decoded);
                insertPg(xlogicDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');        
            break;
        case '153':
            let arquiled_decoded = arquiledDecoder(objectjson);
            if (typeof arquiled_decoded !== 'undefined'){
                //console.log(arquiled_decoded);
                insertPg(arquiledDecoder(objectjson));
            } else {
                console.log(`${formattedDate} => ${objectjson.applicationName}, Device:${objectjson.deviceName}, Payload not valid!`);
            }
            res.send('Data received successfully!');   
            break;
        default:
            res.send('Data received successfully!');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});