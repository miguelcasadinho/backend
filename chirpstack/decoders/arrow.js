
const arrowDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var fPort = message.fPort;
        if (fPort == 1 || fPort == 2) {
            var bytes = Buffer.from(message.data, 'base64');
            var date = new Date((bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24)*1000);
            date = new Date(date.setFullYear(date.getFullYear() + 30));
            date = new Date(date.setTime(date.getTime() - (24 * 60 * 60 * 1000)));
            var data = new Date(date);
            var hour = data.getHours();
            data.setHours(hour-24);
                if (fPort == 1) {
                    data.setHours(11);
                    data.setMinutes(0);
                    data.setSeconds(0);
                }           
                else if (fPort == 2){
                    data.setHours(23);
                    data.setMinutes(0);
                    data.setSeconds(0);
                }
            var error = bytes[4] | bytes[5] << 8;
            var alarms = [];
            if ((error >> 0) & 0x01) {
                alarms.push("Manipulação mecânica");
            };
            if ((error >> 1) & 0x01) {
                alarms.push("Manipulação magnética");
            };
            if ((error >> 2) & 0x01) {
                alarms.push("Fuga");
            };
            if ((error >> 3) & 0x01) {
                alarms.push("Caudal máximo");
            };
            if ((error >> 4) & 0x01) {
                alarms.push("Fluxo inverso");
            };
            if ((error >> 5) & 0x01) {
                alarms.push("Sem consumo");
            };
            if ((error >> 6) & 0x01) {
                alarms.push("Meter Reversed IS");
            };
            if ((error >> 7) & 0x01) {
                alarms.push("Out Of Operating Temperature");
            };
            if ((error >> 10) & 0x01) {
                alarms.push("Bateria fraca");
            };
            if ((error >> 11) & 0x01) {
                alarms.push("Bateria fraca");
            };
            if ((error >> 12) & 0x01) {
                alarms.push("Expired Sealing Period");
            };
            if ((error >> 13) & 0x01) {
                alarms.push("Config Set To Default Value");
            };
            if ((error >> 14) & 0x01) {
                alarms.push("Metrological Wrong Checksum");
            };
            if (alarms.length == 0) {
                alarms.push("No Alarms");
            };
            var vif;
            switch(bytes[6]) {
                case 0x10:
                    vif = 0.001;    
                    break;
                case 0x11:
                    vif = 0.01;    
                    break;
                case 0x12:
                    vif = 0.1;    
                    break;
                case 0x13:
                    vif = 1;    
                    break;
                case 0x14:
                    vif = 10;    
                    break;
                case 0x15:
                    vif = 100;    
                    break;
                case 0x16:
                    vif = 1000;    
                    break;
                case 0x17:
                    vif = 10000;    
                    break;
            };
            var volfin = (bytes[7] | bytes[8] << 8 | bytes[9] << 16 | bytes[10] << 24);
            var volini = (bytes[11] | bytes[12] << 8 | bytes[13] << 16 | bytes[14] << 24);
            var deltas = [];
            for (var i = 15; i < (bytes.length); i+=2) {
                deltas[(i-15)/2] = (bytes[i] | bytes[i+1] << 8)/1000
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
                "DeviceName": message.tags.CONTADOR,
                "Data": message.data,
                "fPort": message.fPort,
                "vif": vif,
                "Alarm": alarms,
                "Date": data,
                "Volume": parseFloat((volini/1000).toFixed(3)),
                "Volume_fin": parseFloat((volfin/1000).toFixed(3)),
                "Deltas": deltas,
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            console.log(payload)
            return payload;
        };
    };   
};

export { arrowDecoder };


    
   