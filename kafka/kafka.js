import { Kafka } from 'kafkajs';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import {kafkaDecoder, kafkaDecoderVol} from './decoder/decoder.js';
import {insertflow, insertvol} from './inskafkapg.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

/*
// Define Avro schema for message serialization and deserialization
const schema = `
  {
    "type": "record",
    "name": "RandomTest",
    "namespace": "examples",
    "fields": [{ "type": "string", "name": "fullName" }]
  }
`;
*/
// Example credentials (replace with actual credentials provided by support)
const username = process.env.kafkaUser;
const password = process.env.kafkaPass;

// Connect to the Schema Registry with provided credentials
const registry = new SchemaRegistry({
  host: process.env.registryHost,
  auth: {
    username,
    password,
  },
});

// Connect to Kafka with provided brokers, SSL, and SASL configurations
const kafka = new Kafka({
    clientId: 'emasbeja',
    brokers: [
      process.env.kafkaBroker1,
      process.env.kafkaBroker2,
      process.env.kafkaBroker3,
    ],
    ssl: {
        rejectUnauthorized: false,
        //ca: [fs.readFileSync("./ca-cert.pem", "utf-8")],
        //key: fs.readFileSync("./client-key.pem", "utf-8"),
        //cert: fs.readFileSync("./client-cert.pem", "utf-8"),
    },
    sasl: {
        mechanism: "scram-sha-512",
        username,
        password,
    },
    connectionTimeout: 10000,
});

const run = async () => {
  try {
    // Register the Avro schema (only needed for producing messages)
    //const { id: schemaId } = await registry.register({
      //type: SchemaType.AVRO,
      //schema,
    //});

    // Create Kafka producer and consumer clients
    //const producer = kafka.producer();
    const consumer = kafka.consumer({ groupId: "f3dd7f9f-1b3c-4e47-a96c-f8018a45d175" });

    // Produce a message (commented out in your original code)
    /*
    await producer.connect();
    await producer.send({
      topic: "test-topic",
      messages: [
        {
          value: await registry.encode(schemaId, { fullName: "Just a Name" }),
        },
      ],
    });
    await producer.disconnect();
    */

     // Subscribe to multiple topics
     const topics = [
      "datahub.event.consumption.daily_14de1838-d341-4d8e-b6ed-8d17f57c58f6",
      "datahub.event.consumption.intraday_14de1838-d341-4d8e-b6ed-8d17f57c58f6"
    ];


    // Connect the consumer and subscribe to the topic
    await consumer.connect();
    //await consumer.subscribe({ topic: "datahub.event.consumption.daily_14de1838-d341-4d8e-b6ed-8d17f57c58f6", fromBeginning: true });
    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
    }

    // Run the consumer to process incoming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const decodedValue = await registry.decode(message.value);
        if (topic === 'datahub.event.consumption.intraday_14de1838-d341-4d8e-b6ed-8d17f57c58f6'){
          try {
          const kafka_decoded = await kafkaDecoder(decodedValue);
          //console.log(kafka_decoded);
          await insertflow(kafka_decoded);
        } catch (err) {
          console.error(err)
        }
        }
        else if (topic === 'datahub.event.consumption.daily_14de1838-d341-4d8e-b6ed-8d17f57c58f6'){
          try {
          const kafka_decoded = await kafkaDecoderVol(decodedValue);
          //console.log(kafka_decoded);
          await insertvol(kafka_decoded);
        } catch (err) {
          console.error(err)
        }
        } 
        else {};       
      },
    });
  } catch (error) {
    console.error("Error in Kafka client:", error);
  }
};

run();

