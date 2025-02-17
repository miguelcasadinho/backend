
const gladiatorDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var bytes = Buffer.from(message.data, 'base64');
        var factor = bytes[8];
        if(factor == 0){
            factor = 0.00001;
        }
        else if(factor == 1){
            factor = 0.0001;
        }
        else if(factor == 2){
            factor = 0.001;
        }
        else if(factor == 3){
            factor = 0.01;
        }
        else if(factor == 4){
            factor = 0.1;
        }
        else if(factor == 5){
            factor = 1;
        }
        else if(factor == 6){
            factor = 10;
        }
        else if(factor == 7){
            factor = 100;
        }
        else if(factor == 8){
            factor = 1000;
        }
        else if(factor == 9){
            factor = 10000;
        }
        else if(factor == 10){
            factor = 100000;
        };
        var tfldl = bytes[9] | bytes[10] << 8;
        var date = new Date();
        var min =date.getMinutes();
        min=min-tfldl;
        date.setMinutes(min);
        var tbr = bytes[11] | bytes[12] << 8;
        switch(bytes[13] | bytes[14] << 8){
            case 0:
                var alarm = "Manipulação";    
                break;
            case 1:
                var alarm = "Cut wire";
                break;
            case 2:
                var alarm = "Bateria fraca"; 
                break;
            case 3:
                var alarm = "Fuga";
                break;
            case 4:
                var alarm = "Fluxo inverso";
                break;
            case 5:
                var alarm = "Power down";
                break;
            case 6:
                var alarm = "Field configuration";
                break;
            case 7:
                var alarm = "Reserve";
                break;    
            case 8:
                var alarm = "Gelo";
                break;
            case 9:
                var alarm = "Caudal máximo";
                break;    
            case 10:
                var alarm = "Poor RF";
                break;    
            case 11:
                var alarm = "DL Active";
                break;        
            case 12:
                var alarm = "DL Mem Err";
                break;
            case 13:
                var alarm = "DL Delta OF";
                break;
            case 14:
                var alarm = "DL Delta Size";
                break;
            case 15:
                var alarm = "Reserve";
                break;    
            default:
                var alarm = "no alarms";
        };
        var battery = (bytes[15] | bytes[16] << 8)/1000;
        if (battery >= 3.64) {
            battery = 3.64;
        }
        else if (battery <= 3.00) {
            battery = 3.00;
        };
        battery = parseFloat((((battery-3)*100)/0.64).toFixed(2));
        var volume = (bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24)/1000;
        var deltas = [];
        for (var i=17;i<(bytes.length);i+=2) {
            deltas[(i-17)/2] = ((bytes[i] | bytes[i+1] << 8)/1000)*factor;
        };
        var rxinfo_length = message.rxInfo.length;
        var snr = [];
        var index;
        for (var a = 0; a < rxinfo_length; a++) {
            snr.push (
                message.rxInfo[a].loRaSNR
            );
            var max = Math.max(...snr);
            index = snr.indexOf(max);
        };
        var gatewayID = (Buffer.from(message.rxInfo[index].gatewayID, 'base64')).toString('hex');
        var payload = {
            "AppID": message.applicationID,
            "Application": message.applicationName,
            "DeviceName": message.deviceName,
            "Data": message.data,
            "fPort": message.fPort,
            "tfldl": tfldl,
            "tbr": tbr,
            "Alarm": alarm,
            "Battery" : battery,
            "Date": date,
            "Volume": parseFloat(volume*factor.toFixed(2)),
            "Deltas": deltas,
            "gateway": gatewayID,
            "rssi": message.rxInfo[index].rssi,
            "snr": message.rxInfo[index].loRaSNR,
            "sf": message.txInfo.loRaModulationInfo.spreadingFactor
        };
        return payload;
    };   
};

export { gladiatorDecoder };



    
    
    
    
   