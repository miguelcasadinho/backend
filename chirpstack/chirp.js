import { axiomaDecoder } from './decoders/axioma.js';
import { arrowDecoder } from './decoders/arrow.js';
import { janzLoraDecoder } from './decoders/janz_lora.js';
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
    switch (appID) {
        case '34':
            console.log(axiomaDecoder(objectjson));
            insertPg(axiomaDecoder(objectjson));    
            res.send('Data received successfully!');
            break;
        case '81':
            console.log(arrowDecoder(objectjson));
            insertPg(arrowDecoder(objectjson));    
            res.send('Data received successfully!');
            break;
        case '119':
            console.log(janzLoraDecoder(objectjson));
            insertPg(janzLoraDecoder(objectjson));    
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