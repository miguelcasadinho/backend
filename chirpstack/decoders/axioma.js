
const axiomaDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var fPort = message.fPort;
        if (message.tags.hasOwnProperty('rph')) {
            var rph = parseInt(message.tags.rph);
        }
        if (fPort == 100) {
            var bytes = Buffer.from(message.data, 'base64');
            switch(bytes[4]) {
                case 144:
                    var alarm = "Gelo";
                    break;
                case 48:
                    var alarm = "Fuga";
                    break;
                case 176:
                    var alarm = "Consumo brusco";
                    break;
                case 208:
                    var alarm = "manipulação";
                    break;
                case 112:
                    var alarm = "Fluxo inverso";
                    break;
                case 16:
                    var alarm = "Sem consumo";
                    break;
                case 1:
                    var alarm = "Permanente";
                    break;
                case 2:
                    var alarm = "Bateria fraca";
                    break;
                default:
                    var alarm = "no alarms";
            };
            var volume_log = (bytes[13] | bytes[14] << 8 | bytes[15] << 16 | bytes[16] << 24)* 0.001;
            var volume = (bytes[5] | bytes[6] << 8 | bytes[7] << 16 | bytes[8] << 24)* 0.001;
            if (message.deviceName == '5229527') {
                var date =new Date(((bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24)* 1000)+74822400000);
                var date_log = new Date(((bytes[9] | bytes[10] << 8 | bytes[11] << 16 | bytes[12] << 24)* 1000)+74822400000);
            }
            else {
                var date =new Date((bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24)* 1000);
                var date_log = new Date((bytes[9] | bytes[10] << 8 | bytes[11] << 16 | bytes[12] << 24)* 1000);
            };
            var deltas = [];
            for (var i=17; i<(bytes.length); i+=2) {
                if (message.tags.hasOwnProperty('rph')) {
                    deltas[(i-17)/2] = parseFloat(((bytes[i] | bytes[i+1] << 8 )*0.001*rph).toFixed(3))
                }
                else {
                    deltas[(i-17)/2] = parseFloat(((bytes[i] | bytes[i+1] << 8 )*0.001).toFixed(3));
                }
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
                "Alarm": alarm,
                "Date": date,
                "Date_log": date_log,
                "Volume": parseFloat(volume.toFixed(2)),
                "Volume_log": parseFloat(volume_log.toFixed(2)),
                "Consumo": parseFloat((volume - volume_log).toFixed(2)),
                "Deltas": deltas,
                "rph": rph,
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            return payload;
        };
    };   
};

export { axiomaDecoder };


    

    
    
    
    
    
   