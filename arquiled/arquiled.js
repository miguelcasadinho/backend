import mqtt from 'mqtt';
import fs from 'fs/promises'; // Use the promise-based version of the filesystem module

// Async function to setup the MQTT connection
async function setupMqttConnection() {
  try {
    // Load certificate files asynchronously
    const KEY = await fs.readFile('./certs/client.key');
    const CERT = await fs.readFile('./certs/client.crt');
    const CA = await fs.readFile('./certs/ca.crt');

    // Define MQTT broker and connection options
    const brokerUrl = 'mqtts://a1znye0h02gqwg-ats.iot.sa-east-1.amazonaws.com:8883'; // Use 'mqtts' for secure connection
    const options = {
      clientId: 'arquiled-beja',
      key: KEY,
      cert: CERT,
      ca: CA,
      rejectUnauthorized: true, // Verify broker against CA
      protocol: 'mqtts', // Secure connection protocol
      //protocolVersion: 4,  // Ensure you're using the correct protocol version for MQTT
      //secureProtocol: 'TLSv1_2_method',  // Enforce TLS 1.2 or another specific version
    };

    // Create an MQTT client
    const client = mqtt.connect(brokerUrl, options);

    // Handle connection event
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Publish message on the topic
    client.publish('test_arquiled_beja', 'Hello from Arquiled Beja!', (err) => {
    if (!err) {
      console.log('Message published successfully');
    }
  });

      client.on('packetsend', (packet) => {
        console.log('Packet sent:', packet);
      });
      
      client.on('packetreceive', (packet) => {
        console.log('Packet received:', packet);
      });
      
      /*
      // Subscribe to a topic
      client.subscribe('test_arquiled_beja', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to topic');
        }
      });
      */
    });
    

    // Handle incoming messages
    client.on('message', (topic, message) => {
      console.log(`Received message: ${message.toString()} on topic: ${topic}`);
    });

    // Handle errors
    client.on('error', (error) => {
      console.error('Connection error:', error);
    });
  } catch (error) {
    console.error('Error reading certificates or connecting to MQTT broker:', error);
  }
}

// Run the function to connect to MQTT
setupMqttConnection();