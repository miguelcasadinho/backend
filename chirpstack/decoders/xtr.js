
const xtrDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var fPort = message.fPort;
        if (fPort == 1) {
            var bytes = Buffer.from(message.data, 'base64');
            var date = new Date ((bytes[8] | bytes[7] << 8 | bytes[6] << 16 | bytes[5] << 24) * 1000);
            var hour = date.getHours();
            hour=hour-2;
            date.setHours(hour);
            switch(bytes[13]){
                case 0:
                       var factor = 0.0000001;    
                       break;
                case 1:
                       var factor = 0.000001;    
                       break;
                case 2:
                       var factor = 0.00001;    
                       break;
                case 3:
                       var factor = 0.0001;    
                       break;
                case 4:
                       var factor = 0.001;    
                       break;
                case 5:
                       var factor = 0.01;    
                       break;
                case 6:
                       var factor = 0.1;    
                       break;
                case 7:
                       var factor = 1;    
                       break;
                case 8:
                       var factor = 10;    
                       break;
                case 9:
                       var factor = 100;    
                       break;
                case 10:
                       var factor = 1000;    
                       break;
                case 11:
                       var factor = 10000;    
                       break;
                case 12:
                       var factor = 100000;    
                       break;
                case 13:
                       var factor = 1000000;    
                       break;
                case 14:
                       var factor = 10000000;    
                       break;
                case 15:
                       var factor = 100000000;    
                       break;
            };
            var volume = (bytes[12] | bytes[11] << 8 | bytes[10] << 16 | bytes[9] << 24) * factor;
            var error = bytes[15] | bytes[14] << 8;
            var alarm = [];
            if ((error >> 0) & 0x01) {
                alarm.push("Manipulação");
            }
            if ((error >> 1) & 0x01) {
                alarm.push("PUS Failure/Cut Wire");
            }
            if ((error >> 2) & 0x01) {
                alarm.push("Fluxo inverso");
            }
            if ((error >> 3) & 0x01) {
                alarm.push("Fuga");
            }
            if ((error >> 4) & 0x01) {
                alarm.push("Poor RF");
            }
            if ((error >> 5) & 0x01) {
                alarm.push("Bateria fraca");
            }
            if ((error >> 6) & 0x01) {
                alarm.push("Field prog.");
            }
            if ((error >> 7) & 0x01) {
                alarm.push("System");
            }
            if ((error >> 8) & 0x01) {
                alarm.push("Gelo");
            }
            if ((error >> 9) & 0x01) {
                alarm.push("Tilt");
            }
            if ((error >> 10) & 0x01) {
                alarm.push("Caudal máximo");
            }
            if ((error >> 11) & 0x01) {
                alarm.push("Consumo brusco");
            }
            if ((error >> 12) & 0x01) {
                alarm.push("Seco");
            }
            if ((error >> 13) & 0x01) {
                alarm.push("Sensus Low Battery");
            }
            if ((error >> 14) & 0x01) {
                alarm.push("Sensus Invalid Read");
            }
            if ((error >> 15) & 0x01) {
                alarm.push("Reserved");
            }
            if (alarm.length == 0){
                alarm.push("No Alarms");
            };
            var battery = (bytes[17] | bytes[16] << 8)/1000;
            if (battery >= 3.64) {
                var bat = 3.64
            }
            else if (battery <= 3.00) {
                var bat = 3.00
            }
            else
            var bat = battery;
            battery = parseFloat((((bat-3)*100)/0.64).toFixed(2));
            var hdeltas = [];
            for (var i=18;i<((bytes.length)-20);i+=2) {
                hdeltas[(i-18)/2] = (bytes[i+1] | bytes[i] << 8) * factor *0.001;
            };
            var wdeltas = [];
            for (var i=30;i<bytes.length;i+=4) {
                wdeltas[(i-30)/4] = (bytes[i+3] | bytes[i+2] << 8 | bytes[i+1] << 16 | bytes[i] << 24) * factor;
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
                "Alarm": alarm,
                "Date": date,
                "Volume": parseFloat((volume*0.001).toFixed(2)),
                "Deltas": hdeltas,
                "WDeltas": wdeltas,
                "Battery": battery,
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            return payload;
        };
    };   
};

export { xtrDecoder };



        




        
    

    
    
    
    
    
   
