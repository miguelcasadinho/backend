
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
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        let bytes = Buffer.from(message.data, 'base64');
        if ((bytes.slice(0, 5).toString('hex') != '5354415254') && (bytes.slice(0, 10).toString('hex') != '466c6f7720616c61726d')){
            let impulse_cnt4 = bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24;
            let impulse_cnt3 = bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24;
            let impulse_cnt2 = bytes[8] | bytes[9] << 8 | bytes[10] << 16 | bytes[11] << 24;
            let impulse_cnt1 = bytes[12] | bytes[13] << 8 | bytes[14] << 16 | bytes[15] << 24;

            let date = new Date((bytes[16] | bytes[17] << 8 | bytes[18] << 16 | bytes[19] << 24)* 1000);

            switch(bytes[20]){
                    case 0:
                        var send_mode = "1h";
                        break;
                    case 1:
                        var send_mode = "2h";
                        break;
                    case 2:
                        var send_mode = "4h";
                        break;
                    case 3:
                        var send_mode = "8h";
                        break;
                    case 4:
                        var send_mode = "12h";
                        break;
                    case 5:
                        var send_mode = "24h";
                        break;
                    default:
                        var send_mode = "Not available";
            }

            switch(bytes[21]){
                    case 255:
                        var read_mode = "15m";
                        break;
                    case 254:
                        var read_mode = "30min";
                        break;
                    case 253:
                        var read_mode = "1h";
                        break;
                    case 252:
                        var read_mode = "2h";
                        break;
                    case 251:
                        var read_mode = "3h";
                        break;
                    case 250:
                        var read_mode = "4h";
                        break;
                    case 249:
                        var read_mode = "6h";
                        break;
                    case 248:
                        var read_mode = "8h";
                        break;
                    case 247:
                        var read_mode = "12h";
                        break;
                    case 246:
                        var read_mode = "24h";
                        break;
                    default:
                        var read_mode = "Not available";
            }

            let tamper = [];
            if ((bytes[22] >> 0) & 0x01) {
                tamper.push("IN1 - tamper detected");
                }
            if ((bytes[22] >> 1) & 0x01) {
                tamper.push("IN2 - tamper detected");
                }
            if ((bytes[22] >> 2) & 0x01) {
                tamper.push("IN3 - tamper detected");
                }
            if ((bytes[22] >> 3) & 0x01) {
                tamper.push("IN4 - tamper detected");
                }
            if ((bytes[22] >> 4) & 0x01) {
                tamper.push("IN5 - tamper detected");
                }
            if ((bytes[22] >> 5) & 0x01) {
                tamper.push("IN6 - tamper detected");
                }
            if ((bytes[22] >> 6) & 0x01) {
                tamper.push("Tamper comes from the accelerometer");
                }
            if ((bytes[22] >> 7) & 0x01) {
                tamper.push("Message is sent due to tamper");
                }

            
            let input_states = [];
                if ((bytes[23] >> 0) & 0x01) {
                input_states.push({IN1 : 1});
                }
                else {
                    input_states.push({IN1 : 0});
                }
                if ((bytes[23] >> 1) & 0x01) {
                input_states.push({IN2 : 1});
                }
                else {
                    input_states.push({IN2 : 0});
                }
                    if ((bytes[23] >> 2) & 0x01) {
                input_states.push({IN3 : 1});
                }
                else {
                    input_states.push({IN3 : 0});
                }
                if ((bytes[23] >> 3) & 0x01) {
                input_states.push({IN4 : 1});
                }
                else {
                    input_states.push({IN4 : 0});
                }
                    if ((bytes[23] >> 4) & 0x01) {
                input_states.push({IN5 : 1});
                }
                else {
                    input_states.push({IN5 : 0});
                }
                if ((bytes[23] >> 5) & 0x01) {
                input_states.push({IN6 : 1});
                }
                else {
                    input_states.push({IN6 : 0});
                }
                    if ((bytes[23] >> 6) & 0x01) {
                input_states.push({IN7 : 1});
                }
                else {
                    input_states.push({IN7 : 0});
                }
                if ((bytes[23] >> 7) & 0x01) {
                input_states.push({IN8 : 1});
                }
                else {
                    input_states.push({IN8 : 0});
                }

            input_states = input_states.reduce((acc, obj) => {
            return {...acc, ...obj};
            }, {});

            let voltage = (bytes[24]*0.01)+2;
            if (voltage >= 3.64) {
                var bat = 3.64
              }
              else if (voltage <= 3.00) {
                var bat = 3.00
              }
              else
              var bat = voltage;
            let battery = parseFloat((((bat-3)*100)/0.64).toFixed(2));

            let temperature = bytes[25];

            let config = [];
                if ((bytes[26] >> 0) & 0x01) {
                config.push({IN1 : "Pulse"});
                }
                else {
                    config.push({IN1 : "Tamper"});
                }
                if ((bytes[26] >> 1) & 0x01) {
                config.push({IN2 : "Pulse"});
                }
                else {
                    config.push({IN2 : "Tamper"});
                }
                    if ((bytes[26] >> 2) & 0x01) {
                config.push({IN3 : "Pulse"});
                }
                else {
                    config.push({IN3 : "Tamper"});
                }
                if ((bytes[26] >> 3) & 0x01) {
                config.push({IN4 : "Pulse"});
                }
                else {
                    config.push({IN4 : "Tamper"});
                }
                    if ((bytes[26] >> 4) & 0x01) {
                config.push({IN5 : "Pulse"});
                }
                else {
                    config.push({IN5 : "Tamper"});
                }
                if ((bytes[26] >> 5) & 0x01) {
                config.push({IN6 : "Pulse"});
                }
                else {
                    config.push({IN6 : "Tamper"});
                }
                    if ((bytes[26] >> 6) & 0x01) {
                config.push({IN7 : "Pulse"});
                }
                else {
                    config.push({IN7 : "Tamper"});
                }
                if ((bytes[26] >> 7) & 0x01) {
                config.push({IN8 : "Pulse"});
                }
                else {
                    config.push({IN8 : "Tamper"});
                }

            config = config.reduce((acc, obj) => {
            return {...acc, ...obj};
            }, {});

            let rxinfo_length = message.rxInfo.length;
            let snr = [];
            let index;
            for (let a = 0; a < rxinfo_length; a++) {
                snr.push (
                    message.rxInfo[a].loRaSNR
                );
                let max = Math.max(...snr);
                index = snr.indexOf(max);
            };
            let gatewayID = (Buffer.from(message.rxInfo[index].gatewayID, 'base64')).toString('hex');

            let leitura_inicial = Number(message.tags.LEITURA_INICIAL);
            let litros_impulso = Number(message.tags.LITROS_IMPULSO);

            let payload = {
                "AppID": message.applicationID,
                "Application": message.applicationName,
                "DeviceName": message.tags.CONTADOR,
                "Data": message.data,
                "fPort": message.fPort,
                "Date": date, 
                "Volume_IN1": parseFloat((((impulse_cnt1*litros_impulso)*0.001)+leitura_inicial).toFixed(2)),
                "Volume_IN2": parseFloat((((impulse_cnt2*litros_impulso)*0.001)+leitura_inicial).toFixed(2)),
                "Volume_IN3": parseFloat((((impulse_cnt3*litros_impulso)*0.001)+leitura_inicial).toFixed(2)),
                "Volume_IN4": parseFloat((((impulse_cnt4*litros_impulso)*0.001)+leitura_inicial).toFixed(2)),
                "SendMode": send_mode,
                "ReadMode": read_mode,
                "InputStates": input_states,
                "Config": config,
                "Battery": battery,
                "Tamper": tamper,
                "Temperature": temperature,
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            return payload;
        }
    }
}

export { xlogicDecoder };
