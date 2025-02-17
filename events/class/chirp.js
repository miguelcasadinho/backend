import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';
import https from 'https';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const appID = [34, 39, 42, 45, 80, 81, 82, 83, 119, 153];

// ChirpStack API configuration
const API_URL = process.env.apiUrl;
const API_KEY = process.env.apiKey;
const BASIC_AUTH_USERNAME = process.env.basicAuthUser;
const BASIC_AUTH_PASSWORD = process.env.basicAuthPass;

// Encode Basic Auth credentials
const basicAuth = Buffer.from(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`).toString('base64');

// Axios instance with default headers
const chirpstackAPI = axios.create({
    baseURL: API_URL,
    headers: {
      'Grpc-Metadata-Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Disable SSL verification
    }),
});

const devices = async (applicationID) => {
    try {
        const response = await chirpstackAPI.get(`/devices?limit=9999&&applicationID=${applicationID}`);
        //console.log('Devices:', response.data);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching devices:', error.response?.data || error.message);
    }
}

// Main function to fetch and filter devices not seen in the last 7 days
const getDevices7days = async () => {
    try {
        const msg = [];
        const today = new Date(); // Current date
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7); // Subtract 7 days

        for (const app of appID) {
            const devicesdata = await devices(app);
            for (const device of devicesdata) {
                if (device.lastSeenAt) {
                    const lastSeenDate = new Date(device.lastSeenAt); // Convert to Date object
                    if (lastSeenDate < sevenDaysAgo && device.description != 'DESINSTALADO') {
                        msg.push({
                            device: device.name,
                            description: device.description,
                            lastSeen: lastSeenDate.toISOString(), // Format date as ISO string
                        });
                    }
                }
            }
        }

        // Print formatted result
        //console.log('Dispositivos não vistos nos últimos 7 dias:');
        //console.table(msg);
        return msg;
    } catch (error) {
        console.error('Error in getDevices7days:', error);
    }
};

// Main function to fetch and filter devices never seen
const getDevicesNeverSeen = async () => {
    try {
        const msg = [];
        for (const app of appID) {
            const devicesdata = await devices(app);
            for (const device of devicesdata) {
                if (!device.lastSeenAt) {
                    if (!['awayt renit','Axioma-CONTAQUA', 'Contador de Água', 'Sagemcom', 'Leitor de Impulsos', 'Pelame'].includes(device.description)){
                        msg.push({
                            device: device.name,
                            description: device.description,
                            lastSeen: 'Sem comunicações', 
                        });
                    }
                }
            }
        }

        // Print formatted result
        //console.log('Dispositivos por ativar:');
        //console.table(msg);
        return msg;
    } catch (error) {
        console.error('Error in getDevicesNeverSeen:', error);
    }
};

export { getDevices7days, getDevicesNeverSeen };

