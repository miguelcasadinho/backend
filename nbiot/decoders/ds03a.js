import { devices } from './devices.js';

const ds03aDecoder = (message) => {
    try {
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