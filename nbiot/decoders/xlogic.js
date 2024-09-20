
import { devices } from './devices.js';

function hexToAscii(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }
  
  function checkBit(byte, bitPosition) {
    return (byte & (1 << bitPosition)) !== 0;
  }
  
  function parseConfigByte(configByte) {
    const inputs = [];
    for (let i = 0; i < 6; i++) {
      inputs[i] = checkBit(configByte, i) ? 'Pulse' : 'Tamper';
    }
    return {
      IN1: inputs[0],
      IN2: inputs[1],
      IN3: inputs[2],
      IN4: inputs[3],
      IN5: inputs[4],
      IN6: inputs[5]
    };
  }
  
  function findPulseConfigKeys(data) {
    const pulseConfigKeys = [];
    
    for (const key in data) {
      if (data[key] === "Pulse") {
        pulseConfigKeys.push(key);
      }
    }
    
    return pulseConfigKeys;
  }


const xlogicDecoder = (message) => {
    try {
        let bytes = Buffer.from(message, 'hex');
        let decoded = {};
        let length = bytes.length;

        let IMEI = hexToAscii(bytes.slice(length-38, length-23).toString('hex'));

        const device = devices.find(device => device.imei === IMEI);

        if (device && (bytes.slice(0, 5).toString('hex') != '5354415254') && (bytes.slice(0, 10).toString('hex') != '466c6f7720616c61726d')){
            const { pulse, meter, vol_ini, lit_pul, model } = device;
            decoded.pulse = pulse;
            decoded.device = meter;
            decoded.vol_ini = vol_ini;
            decoded.lit_pul = lit_pul;
            decoded.model = model;
            decoded.IMEI = IMEI;
            decoded.IMSI = hexToAscii(bytes.slice(length-15, length).toString('hex'));

            let impulse_cnt6 = bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24;
            let impulse_cnt5 = bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24;
            let impulse_cnt4 = bytes[8] | bytes[9] << 8 | bytes[10] << 16 | bytes[11] << 24;
            let impulse_cnt3 = bytes[12] | bytes[13] << 8 | bytes[14] << 16 | bytes[15] << 24;
            let impulse_cnt2 = bytes[16] | bytes[17] << 8 | bytes[18] << 16 | bytes[19] << 24;
            let impulse_cnt1 = bytes[20] | bytes[21] << 8 | bytes[22] << 16 | bytes[23] << 24;

            if (decoded.pulse === 1){
                decoded.volume = parseFloat((((impulse_cnt1*lit_pul)*0.001)+vol_ini).toFixed(2));
            }
            else if (decoded.pulse === 2){
                decoded.volume = parseFloat((((impulse_cnt2*lit_pul)*0.001)+vol_ini).toFixed(2));
            }
            else if (decoded.pulse === 3){
                decoded.volume = parseFloat((((impulse_cnt3*lit_pul)*0.001)+vol_ini).toFixed(2));
            }
            else if (decoded.pulse === 4){
                decoded.volume = parseFloat((((impulse_cnt4*lit_pul)*0.001)+vol_ini).toFixed(2));
            }
            else if (decoded.pulse === 5){
                decoded.volume = parseFloat((((impulse_cnt5*lit_pul)*0.001)+vol_ini).toFixed(2));
            }
            else if (decoded.pulse === 6){
                decoded.volume = parseFloat((((impulse_cnt6*lit_pul)*0.001)+vol_ini).toFixed(2));
            }

            decoded.date = new Date((bytes[24] | bytes[25] << 8 | bytes[26] << 16 | bytes[27] << 24)* 1000);

            switch(bytes[28]){
                case 0:
                    decoded.send_mode = "1h";
                    break;
                case 1:
                    decoded.send_mode = "2h";
                    break;
                case 2:
                    decoded.send_mode = "4h";
                    break;
                case 3:
                    decoded.send_mode = "8h";
                    break;
                case 4:
                    decoded.send_mode = "12h";
                    break;
                case 5:
                    decoded.send_mode = "24h";
                    break;
                default:
                    decoded.send_mode = "Not available";
            }
        
            switch(bytes[29]){
                case 255:
                    decoded.read_mode = "15m";
                    break;
                case 254:
                    decoded.read_mode = "30min";
                    break;
                case 253:
                    decoded.read_mode = "1h";
                    break;
                case 252:
                    decoded.read_mode = "2h";
                    break;
                case 251:
                    decoded.read_mode = "3h";
                    break;
                case 250:
                    decoded.read_mode = "4h";
                    break;
                case 249:
                    decoded.read_mode = "6h";
                    break;
                case 248:
                    decoded.read_mode = "8h";
                    break;
                case 247:
                    decoded.read_mode = "12h";
                    break;
                case 246:
                    decoded.read_mode = "24h";
                    break;
                default:
                    decoded.read_mode = "Not available";
            }
        
        let tamper = [];
        if ((bytes[30] >> 0) & 0x01) {
            tamper.push("IN1 - tamper detected");
            }
        if ((bytes[30] >> 1) & 0x01) {
            tamper.push("IN2 - tamper detected");
            }
        if ((bytes[30] >> 2) & 0x01) {
            tamper.push("IN3 - tamper detected");
            }
        if ((bytes[30] >> 3) & 0x01) {
            tamper.push("IN4 - tamper detected");
            }
        if ((bytes[30] >> 4) & 0x01) {
            tamper.push("IN5 - tamper detected");
            }
        if ((bytes[30] >> 5) & 0x01) {
            tamper.push("IN6 - tamper detected");
            }
        if ((bytes[30] >> 6) & 0x01) {
            tamper.push("Tamper comes from the accelerometer");
            }
        if ((bytes[30] >> 7) & 0x01) {
            tamper.push("Message is sent due to tamper");
            }
        if (tamper.length > 0){
            decoded.tamper = tamper;
        }
           
        let input_states = [];
            if ((bytes[31] >> 0) & 0x01) {
            input_states.push({IN1 : 1});
            }
            else {
                input_states.push({IN1 : 0});
            }
            if ((bytes[31] >> 1) & 0x01) {
            input_states.push({IN2 : 1});
            }
            else {
                input_states.push({IN2 : 0});
            }
                if ((bytes[31] >> 2) & 0x01) {
            input_states.push({IN3 : 1});
            }
            else {
                input_states.push({IN3 : 0});
            }
            if ((bytes[31] >> 3) & 0x01) {
            input_states.push({IN4 : 1});
            }
            else {
                input_states.push({IN4 : 0});
            }
                if ((bytes[31] >> 4) & 0x01) {
            input_states.push({IN5 : 1});
            }
            else {
                input_states.push({IN5 : 0});
            }
            if ((bytes[31] >> 5) & 0x01) {
            input_states.push({IN6 : 1});
            }
            else {
                input_states.push({IN6 : 0});
            }
                if ((bytes[31] >> 6) & 0x01) {
            input_states.push({IN7 : 1});
            }
            else {
                input_states.push({IN7 : 0});
            }
            if ((bytes[31] >> 7) & 0x01) {
            input_states.push({IN8 : 1});
            }
            else {
                input_states.push({IN8 : 0});
            }
        
        decoded.input_states = input_states.reduce((acc, obj) => {
          return {...acc, ...obj};
        }, {});
        
        decoded.voltage = (bytes[32]*0.01)+2;

        if (decoded.voltage >= 3.64) {
            var bat = 3.64
            }
            else if (decoded.voltage <= 3.00) {
            var bat = 3.00
            }
            else
            var bat = decoded.voltage;
        decoded.battery = parseFloat((((bat-3)*100)/0.64).toFixed(2));
        
        decoded.temperature = bytes[33];
        
        let config = [];
            if ((bytes[34] >> 0) & 0x01) {
            config.push({IN1 : "Pulse"});
            }
            else {
                config.push({IN1 : "Tamper"});
            }
            if ((bytes[34] >> 1) & 0x01) {
            config.push({IN2 : "Pulse"});
            }
            else {
                config.push({IN2 : "Tamper"});
            }
                if ((bytes[34] >> 2) & 0x01) {
            config.push({IN3 : "Pulse"});
            }
            else {
                config.push({IN3 : "Tamper"});
            }
            if ((bytes[34] >> 3) & 0x01) {
            config.push({IN4 : "Pulse"});
            }
            else {
                config.push({IN4 : "Tamper"});
            }
                if ((bytes[34] >> 4) & 0x01) {
            config.push({IN5 : "Pulse"});
            }
            else {
                config.push({IN5 : "Tamper"});
            }
            if ((bytes[34] >> 5) & 0x01) {
            config.push({IN6 : "Pulse"});
            }
            else {
                config.push({IN6 : "Tamper"});
            }
                if ((bytes[34] >> 6) & 0x01) {
            config.push({IN7 : "Pulse"});
            }
            else {
                config.push({IN7 : "Tamper"});
            }
            if ((bytes[34] >> 7) & 0x01) {
            config.push({IN8 : "Pulse"});
            }
            else {
                config.push({IN8 : "Tamper"});
            }
        
        decoded.config = config.reduce((acc, obj) => {
          return {...acc, ...obj};
        }, {});
        
        decoded.RSRQ = bytes[35];
        decoded.SNR = bytes[36];

        console.log(decoded);
        return decoded;
        }

    } catch (error) {
    console.error("Error decoding message:", error);
    return null;
    }
}

export { xlogicDecoder };

