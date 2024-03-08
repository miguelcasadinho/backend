
const janz2Decoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var bytes = Buffer.from(message.data, 'base64');
        if (bytes.length == 49){
            //var device_sn = (bytes[2] | bytes[3] << 8 | bytes[4] << 16 | bytes[5] << 24);
            //var meter_sn = (bytes[6] | bytes[7] << 8 | bytes[8] << 16 | bytes[9] << 24 | bytes[10] << 32);
            var date = new Date ((bytes[11] | bytes[12] << 8 | bytes[13] << 16 | bytes[14] << 24) * 1000);
            var error_flag = bytes[15] | bytes[16] << 8;
            var alarm = [];
            if ((error_flag >> 0) & 0x01) {
                alarm.push("Caudal máximo");
            };
            if ((error_flag >> 1) & 0x01) {
                alarm.push("Manipulação magnética");
            };
            if ((error_flag >> 2) & 0x01) {
                alarm.push("Fuga");
            };
            if ((error_flag >> 3) & 0x01) {
                alarm.push("Fluxo inverso");
            };
            if ((error_flag >> 4) & 0x01) {
                alarm.push("Extreme temperature");
            };
            if ((error_flag >> 5) & 0x01) {
                alarm.push("Sem consumo");
            };
            if ((error_flag >> 6) & 0x01) {
                alarm.push("Erro de harware temporário");
            };
            if ((error_flag >> 7) & 0x01) {
                alarm.push("Erro de harware permanente");
            };
            if ((error_flag >> 12) & 0x01) {
                alarm.push("Sensor removido");
            };
            if ((error_flag >> 13) & 0x01) {
                alarm.push("Communicação iniciada e dados enviados com sucesso");
            };
            if ((error_flag >> 14) & 0x01) {
                alarm.push("Underflow during 24hrs");
            };
            if ((error_flag >> 15) & 0x01) {
                alarm.push("Bateria fraca");
            };
            if (alarm.length == 0){
                alarm.push("No Alarms");
            };
            var bat_flag = bytes[16] & 0x0F;
            if (bat_flag == 0x01) {
                var battery = 5;
            };
            if (bat_flag == 0x02) {
                var battery = 10;
            };
            if (bat_flag == 0x03) {
                var battery = 15;
            };
            if (bat_flag == 0x04) {
                var battery = 20;
            };
            if (bat_flag == 0x05) {
                var battery = 25;
            };
            if (bat_flag == 0x06) {
                var battery = 30;
            };
            if (bat_flag == 0x07) {
                var battery = 40;
            };
            if (bat_flag == 0x08) {
                var battery = 50;
            };
            if (bat_flag == 0x09) {
                var battery = 60;
            };
            if (bat_flag == 0x0A) {
                var battery = 70;
            };
            if (bat_flag == 0x0A) {
                var battery = 70;
            };
            if (bat_flag == 0x0B) {
                var battery = 80;
            };
            if (bat_flag == 0x0C) {
                var battery = 85;
            };
            if (bat_flag == 0x0D) {
                var battery = 90;
            };
            if (bat_flag == 0x0E) {
                var battery = 95;
            };
            if (bat_flag == 0x0F) {
                var battery = 100;
            };
            var deltas = [];
            for (var i=17;i<41;i+=2) {
                var value = bytes[i] | bytes[i+1] << 8;
                if (value < 32768){
                    deltas[(i-17)/2] = value;
                }
                else
                    deltas[(i-17)/2] = 0;
            };
            var b41_0 = bytes[41] >> 4;
            if (b41_0 == 0){
                var profile = 'Standard';
            };
            if (b41_0 == 1){
                var profile = 'Extreme';
            };   
            var b41_1 = bytes[41] & 0x0F;
            if (b41_1 == 0x00){
                var ind = '12h00 to 00h00';
            };
            if (b41_1 == 1){
                var ind = '00h00 to 12h00';
            };
            var offset = bytes[44] >> 4 | bytes[43] << 4 | bytes[42] << 12;
            switch(bytes[44] & 0x0F){
                case 2:
                   var counter_coefficient = 100000;    
                   break;
                case 1:
                    var counter_coefficient = 10000;
                    break;
                case 0:
                    var counter_coefficient = 1000; 
                    break;
                case 15:
                    var counter_coefficient = 100;
                    break;
                case 14:
                    var counter_coefficient = 10;
                    break;
                case 13:
                    var counter_coefficient = 1;
                    break;
                case 12:
                    var counter_coefficient = 0.1;
                    break;    
                default:
                    var counter_coefficient = 1;
            };
            var pulse_counter = (bytes[45] | bytes[46] << 8 | bytes[47] << 16 | bytes[48] << 24); 
            var volume = (pulse_counter * counter_coefficient) + offset;
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
                "Deltas": deltas,
                "Battery": battery,
                "Profile": profile,
                "Index": ind,
                "Offset": offset,
                "Counter_coefficient": counter_coefficient,
                "Pulse_counter":pulse_counter,
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            return payload;
        };
    };   
};

export { janz2Decoder };



        




        
    

    
    
    
    
    
   