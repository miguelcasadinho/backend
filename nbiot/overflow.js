import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
import { wlDecoder } from './decoders/water_leak.js';
import { insertPg } from './ins_pg.js';
import mqtt from 'mqtt';

// MQTT broker connection options
const options = {
    port: process.env.mqttMciotPort,
    username: process.env.mqttMciotUser,
    password: process.env.mqttMciotPass,
    //clientId: 'client_id' 
};

// Connect to an MQTT broker with authentication
const client = mqtt.connect(process.env.mqttMciotAddr, options);

// Event handler for when the client is connected
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('overflow');
    //client.publish('my/topic', 'Hello, MQTT!');
});

// Event handler for when a message is received
client.on('message', (topic, message) => {
    //console.log('Received message:', message.toString());
    console.log(wlDecoder(message.toString()));
    insertPg(wlDecoder(message.toString()));
});

// Event handler for when the client is disconnected
client.on('close', () => {
    console.log('Disconnected from MQTT broker');
});