
const sagemDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var fPort = message.fPort;
        if (fPort == 1) {
            var bytes = Buffer.from(message.data, 'base64');
            var offset;
            var FOS = (bytes[2] | bytes[1] << 8);
            if (FOS == 0xEA60){   
                offset = 9;
                let error_flag = (bytes[5] | bytes[6] << 8  | bytes[7] << 16 | bytes[8] << 24);
                let alarmsArray = [];
                if ((error_flag >> 0) & 0x01) {
                    alarmsArray.push("Low air temperature");
                };
                if ((error_flag >> 1) & 0x01) {
                    alarmsArray.push("High air temperature");
                };
                if ((error_flag >> 2) & 0x01) {
                    alarmsArray.push("Gelo");
                };
                if ((error_flag >> 3) & 0x01) {
                    alarmsArray.push("High water temperature");
                };
                if ((error_flag >> 4) & 0x01) {
                    alarmsArray.push("Fraud suspicion");
                };
                if ((error_flag >> 5) & 0x01) {
                    alarmsArray.push("Fuga");
                };
                if ((error_flag >> 6) & 0x01) {
                    alarmsArray.push("Fuga grande");
                };
                if ((error_flag >> 7) & 0x01) {
                    alarmsArray.push("Air bubbles");
                };
                if ((error_flag >> 8) & 0x01) {
                    alarmsArray.push("Seco");
                };
                if ((error_flag >> 9) & 0x01) {
                    alarmsArray.push("Hardware error");
                };
                if ((error_flag >> 10) & 0x01) {
                    alarmsArray.push("Sem consumo");
                };
                if ((error_flag >> 11) & 0x01) {
                    alarmsArray.push("Fluxo inverso");
                };
                if ((error_flag >> 12) & 0x01) {
                    alarmsArray.push("Bateria baixa");
                };
                if ((error_flag >> 13) & 0x01) {
                    alarmsArray.push("Bateria critica");
                };
                if ((error_flag >> 14) & 0x01) {
                    alarmsArray.push("Metrological CRC error");
                };
                if ((error_flag >> 15) & 0x01) {
                    alarmsArray.push("Manipulação");
                };
                if ((error_flag >> 16) & 0x01) {
                    alarmsArray.push("Caudal máximo");
                };
                var alarm = alarmsArray;
            }
            else if (FOS == 0x78ee){   
                offset = 11;
                let error_flag = (bytes[5] | bytes[6] << 8  | bytes[7] << 16 | bytes[8] << 24);
                let alarmsArray = [];
                if ((error_flag >> 0) & 0x01) {
                    alarmsArray.push("Low air temperature");
                };
                if ((error_flag >> 1) & 0x01) {
                    alarmsArray.push("High air temperature");
                };
                if ((error_flag >> 2) & 0x01) {
                    alarmsArray.push("Gelo");
                };
                if ((error_flag >> 3) & 0x01) {
                    alarmsArray.push("High water temperature");
                };
                if ((error_flag >> 4) & 0x01) {
                    alarmsArray.push("Fraud suspicion");
                };
                if ((error_flag >> 5) & 0x01) {
                    alarmsArray.push("Fuga");
                };
                if ((error_flag >> 6) & 0x01) {
                    alarmsArray.push("Fuga grande");
                };
                if ((error_flag >> 7) & 0x01) {
                    alarmsArray.push("Air bubbles");
                };
                if ((error_flag >> 8) & 0x01) {
                    alarmsArray.push("Seco");
                };
                if ((error_flag >> 9) & 0x01) {
                    alarmsArray.push("Hardware error");
                };
                if ((error_flag >> 10) & 0x01) {
                    alarmsArray.push("Sem consumo");
                };
                if ((error_flag >> 11) & 0x01) {
                    alarmsArray.push("Fluxo inverso");
                };
                if ((error_flag >> 12) & 0x01) {
                    alarmsArray.push("Bateria baixa");
                };
                if ((error_flag >> 13) & 0x01) {
                    alarmsArray.push("Bateria critica");
                };
                if ((error_flag >> 14) & 0x01) {
                    alarmsArray.push("Metrological CRC error");
                };
                if ((error_flag >> 15) & 0x01) {
                    alarmsArray.push("Manipulação");
                };
                if ((error_flag >> 16) & 0x01) {
                    alarmsArray.push("Caudal máximo");
                };
                var alarm = alarmsArray;
            }
            else if (FOS == 0x7a0e){
                offset = 17;
                let error_flag = (bytes[13] | bytes[14] << 8  | bytes[15] << 16 | bytes[16] << 24);
                let alarmsArray = [];
                if ((error_flag >> 0) & 0x01) {
                    alarmsArray.push("Low air temperature");
                };
                if ((error_flag >> 1) & 0x01) {
                    alarmsArray.push("High air temperature");
                };
                if ((error_flag >> 2) & 0x01) {
                    alarmsArray.push("Gelo");
                };
                if ((error_flag >> 3) & 0x01) {
                    alarmsArray.push("High water temperature");
                };
                if ((error_flag >> 4) & 0x01) {
                    alarmsArray.push("Fraud suspicion");
                };
                if ((error_flag >> 5) & 0x01) {
                    alarmsArray.push("Fuga");
                };
                if ((error_flag >> 6) & 0x01) {
                    alarmsArray.push("Fuga grande");
                };
                if ((error_flag >> 7) & 0x01) {
                    alarmsArray.push("Air bubbles");
                };
                if ((error_flag >> 8) & 0x01) {
                    alarmsArray.push("Seco");
                };
                if ((error_flag >> 9) & 0x01) {
                    alarmsArray.push("Hardware error");
                };
                if ((error_flag >> 10) & 0x01) {
                    alarmsArray.push("Sem consumo");
                };
                if ((error_flag >> 11) & 0x01) {
                    alarmsArray.push("Fluxo inverso");
                };
                if ((error_flag >> 12) & 0x01) {
                    alarmsArray.push("Bateria baixa");
                };
                if ((error_flag >> 13) & 0x01) {
                    alarmsArray.push("Bateria critica");
                };
                if ((error_flag >> 14) & 0x01) {
                    alarmsArray.push("Metrological CRC error");
                };
                if ((error_flag >> 15) & 0x01) {
                    alarmsArray.push("Manipulação");
                };
                if ((error_flag >> 16) & 0x01) {
                    alarmsArray.push("Caudal máximo");
                };
                //var netvolume = parseFloat(((bytes[9] | bytes[10] << 8  | bytes[11] << 16 | bytes[12] << 24) / 1000).toFixed(2));
                let backflow = bytes[5] | bytes[6] << 8  | bytes[7] << 16 | bytes[8] << 24;
                alarmsArray.push(`Volume inverso: ${backflow} litro(s)`);
                var alarm = alarmsArray;
            }
            else if (FOS == 0x2142){
                offset = 13;
                //var netvolume = parseFloat(((bytes[9] | bytes[10] << 8  | bytes[11] << 16 | bytes[12] << 24) / 1000).toFixed(2));
                let backflow = bytes[5] | bytes[6] << 8  | bytes[7] << 16 | bytes[8] << 24;
                var alarm = `Volume inverso: ${backflow} litro(s)`;
            }
            else if (FOS == 0xEFF0){
                offset = 5;
                var alarm = "no alarms";
            }
            else if (FOS == 0xAA7D){
                offset = 7;
                var alarm = "no alarms";
            }
            else {
                offset = 5;
                var alarm = "FOS desconhecido";
            }

            //Check delta0 and volume bug and ignore supervision frame and instalation frame and alarm frame and backflow frame, uninstall frame and unknow frame 14aa
            if (((bytes[4+offset] | bytes[5+offset] << 8) !== (bytes[11+offset] | bytes[11+offset+1] << 8 )) && FOS !== 0x04fd 
                    && FOS !== 0x825e && FOS !== 0xd90b && FOS !== 0xc374 && FOS !== 0x65fa && FOS !== 0x14aa){
                var minute = (bytes[0+offset] & 0x3F);
                var hour = (bytes[1+offset] & 0x1F);
                var day = (bytes[2+offset] & 0x1F);
                var month = (bytes[3+offset] & 0x0F);
                var year = 1900 + 100*((bytes[1+offset]  & 0xf0 ) >> 5) + (((bytes[3+offset]  & 0xF0 ) >> 4) << 3) | ((bytes[2+offset]  & 0xE0 ) >> 5);
                var date = new Date(year,month-1,day,hour,minute);
                var volume = (bytes[4+offset] | bytes[5+offset] << 8  | bytes[6+offset] << 16 | bytes[7+offset] << 24) / 1000;
                var deltas = [];
                for (var i=11+offset; i<(bytes.length); i+=2) {
                    if ((bytes[i] | bytes[i+1] << 8) !== 0xffff){ // check the 0xffff bug 
                        deltas[(i-(11+offset))/2] = (bytes[i] | bytes[i+1] << 8 ) / 1000;
                    };
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
                    "Volume": parseFloat(volume.toFixed(2)),
                    "Deltas": deltas,
                    "gateway": gatewayID,
                    "rssi": message.rxInfo[index].rssi,
                    "snr": message.rxInfo[index].loRaSNR,
                    "sf": message.txInfo.loRaModulationInfo.spreadingFactor
                };
                return payload;
            };
        };   
    };
};

export { sagemDecoder };





    
    
    
    
    
   