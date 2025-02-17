import axios from 'axios';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

/*
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { cpl03Decoder } from './decoders/cpl03.js';
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
const topics = ['post'];
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
    switch(topic) {
        case 'post':
            let cpl03_decoded = await cpl03Decoder(message.toString());
            if (typeof cpl03_decoded !== 'undefined'){
                //console.log(cpl03Decoder(message.toString()));
                postWebhook(cpl03_decoded);
            } else {
                console.log(`${formattedDate} => IMEI: ${message.toString().substring(1,16)}, don't have any meter associated!`);
            }
            break;
        default:
            console.log(`Received message on unknown topic: ${topic}`);
        }
});
// Event handler for when the client is disconnected
client.on('close', () => {
    console.log('Disconnected from MQTT broker');
});
*/

// Define the webhook URL, payload, and token
const webhookUrl = process.env.BaseformURL;

const token = 'bearer-token';
const username = 'username';
const password = 'password';

// Define an async function to insert flow cpl03 water meters
const postWebhook = async (payload) => {
    try {
        let message = [];
        for (let i=1; i < payload.deltasVol.length -1; i++){
            message.push({
                "id": payload.tag_id,
                "device": payload.device,
                "Timestamp": payload.deltasVol[i].date,
                "Valor": parseFloat(((((payload.deltasVol[i].index1)*payload.lit_pul)*0.001)+payload.vol_ini).toFixed(2))
            })
        }
        //console.log(message);
        const response = await axios.post(webhookUrl, message, {
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${token}`,
            },
            //auth: {
                //username,
                //password,
            //},
        });
        console.log('Status:', response.status);
        //console.log('Response Data:', response.data);
    }catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
            console.error('Status Code:', error.response.status);
        } else {
            console.error('Error Message:', error.message);
        }
    }
};

export { postWebhook };

