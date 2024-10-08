import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});



// Define an async function to get NB-IoT devices
const getDevices = async (device) => {
    const query = {
        text: `
    SELECT 
        nbiot_devices_id,
        asset,
        model,
        sn,
        imei,
        at_pin,
        p_n,
        h_w,
        number,
        pin,
        puk,
        pulse,
        lit_pul,
        vol_ini::float,  -- Cast vol_ini to float
        meter,
        rph,
        report
    FROM 
        nbiot_devices`
    };

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        //console.log(result.rows)
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Failed to execute query');
    }
};

const ds03aDecoder = async (message) => {
    try {
        const devices = await getDevices();
        let bytes = Buffer.from(message, 'hex');
        let hexa = message;
        let decoded = {};
        decoded.IMEI = hexa.substring(1,16);
        const device = devices.find(device => device.imei === decoded.IMEI);
        if (device) {
            const { model, asset } = device;
            decoded.model = model;
            decoded.asset = asset;
            decoded.version= bytes[9] | bytes[8] << 8;
            let battery = (bytes[11] | bytes[10] << 8)/1000;
            let bat = Math.min(3.64, Math.max(3.00, battery));
            decoded.battery = parseFloat((((bat - 3) * 100) / 0.64).toFixed(2));
            decoded.signal = bytes[12];
            decoded.mode = bytes[13];
            decoded.door_status = bytes[14];
            decoded.alarm_status = bytes[15];
            decoded.open_num = bytes[18] | bytes[17] << 8 | bytes[16] << 16;
            decoded.last_opentime = bytes[21] | bytes[20] << 8 | bytes[19] << 16;
            decoded.data = new Date((bytes[25] | bytes[24] << 8 | bytes[23] << 16 | bytes[22] << 24)*1000);
            //console.log(decoded);
            return decoded;
        }
    } catch (error) {
        console.error("Error decoding message:", error);
        return null;
    }
};

export { ds03aDecoder };