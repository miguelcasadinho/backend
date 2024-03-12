
const ldds75Decoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var fPort = message.fPort;
        if (fPort == 2) {
            var bytes = Buffer.from(message.data, 'base64');
            var distance= (bytes[2]<<8 | bytes[3])/1000;
            var battery = ((bytes[0]<<8 | bytes[1]) & 0x3FFF)/1000;
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
                "Date": new Date(),
                "Distance": distance,
                "Battery": battery,
                "Lat" : parseFloat(message.tags.lat),
                "Lon" : parseFloat(message.tags.lon),
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            return payload;
        };
    };   
};

export { ldds75Decoder };


    

    
    
    
    
    
   