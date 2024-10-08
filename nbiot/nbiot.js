import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { wlDecoder } from './decoders/water_leak.js';
import { cpl03Decoder } from './decoders/cpl03.js';
import { xlogicDecoder } from './decoders/xlogic.js';
import { ds03aDecoder } from './decoders/ds03a.js';
import { insertPg, insertMeters } from './ins_pg.js';
import mqtt from 'mqtt';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

// MQTT broker connection options
const options = {
    port: process.env.mqttIotserverPort,
    username: process.env.mqttIotserverUser,
    password: process.env.mqttIotserverPass,
    //clientId: 'client_id' 
};

// MQTT topics you want to subscribe to
const topics = ['overflow', 'cpl03', 'xlogic', 'ds03a'];

// Connect to an MQTT broker with authentication
const client = mqtt.connect(process.env.mqttIotserverAddr, options);

// Event handler for when the client is connected
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topics);
    //client.publish('my/topic', 'Hello, MQTT!');
});

// Event handler for when a message is received
client.on('message', async (topic, message) => {
    // Handle messages for different topics
    const data_tr = new Date();
    const year = data_tr.getFullYear();
    const month = String(data_tr.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(data_tr.getDate()).padStart(2, '0');
    const hour = String(data_tr.getHours()).padStart(2, '0');
    const min = String(data_tr.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hour}:${min}`;
    switch(topic) {
        case 'overflow':
            //console.log(wlDecoder(message.toString()));
            insertPg(wlDecoder(message.toString()));
            break;
        case 'cpl03':
            let cpl03_decoded = await cpl03Decoder(message.toString());
            if (typeof cpl03_decoded !== 'undefined'){
                //console.log(cpl03Decoder(message.toString()));
                insertMeters(cpl03_decoded);
            } else {
                console.log(`${formattedDate} => IMEI: ${message.toString().substring(1,16)}, don't have any meter associated!`);
            }
            break;
        case 'xlogic':
            let xlogic_decoded = await xlogicDecoder(message.toString('hex'));
            if (typeof xlogic_decoded !== 'undefined'){
                //console.log(xlogic_decoded);
                insertMeters(xlogic_decoded);
            } else {
                console.log(`${formattedDate} => Don't find any meter associated!`);
            }
            break;
        case 'ds03a':
            let ds03a_decoded = await ds03aDecoder(message.toString());
            if (typeof ds03a_decoded !== 'undefined'){
                //console.log(ds03a_decoded);
                insertPg(ds03a_decoded);
            } else {
                console.log(`${formattedDate} => Don't find any asset associated!`);
            }
            break;
        case 'topic3':
            console.log('topic3');
            // Handle topic3 message
            // insertPg or any other operation
            break;
        default:
            console.log(`Received message on unknown topic: ${topic}`);
    }
});

// Event handler for when the client is disconnected
client.on('close', () => {
    console.log('Disconnected from MQTT broker');
});