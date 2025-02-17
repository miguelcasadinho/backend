
const pslbDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var fPort = message.fPort;
        if (fPort == 2) {
            var bytes = Buffer.from(message.data, 'base64');
            var Probe_mod= bytes[2];
            var IDC_intput_mA= (bytes[4]<<8 | bytes[5])/1000;
            if(Probe_mod===0x00)
            {
              if(IDC_intput_mA<=4.0)
                 var deltas= 0;
              else
                var deltas= parseFloat(((IDC_intput_mA-4.0)*(bytes[3]*100/16)).toFixed(3));
            }
            else if(Probe_mod==0x01)
            {
              if(IDC_intput_mA<=4.0)
                 var deltas= 0;
              else if(bytes[3]==1)
               var deltas = parseFloat(((IDC_intput_mA-4.0)*0.0375).toFixed(3));
              else if(bytes[3]==2)
                var deltas= parseFloat(((IDC_intput_mA-4.0)*0.0625).toFixed(3));   
              else if(bytes[3]==3)
                var deltas= parseFloat(((IDC_intput_mA-4.0)*0.1).toFixed(3)); 
              else if(bytes[3]==4)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*0.15625).toFixed(3));
              else if(bytes[3]==5)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*0.625).toFixed(3));  
              else if(bytes[3]==6)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*2.5).toFixed(3));   
              else if(bytes[3]==7)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*3.75).toFixed(3));  
              else if(bytes[3]==8)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*-0.00625).toFixed(3));    
              else if(bytes[3]==9){
                if(IDC_intput_mA<=12.0){
                    var deltas= parseFloat(((IDC_intput_mA-4.0)*-0.0125).toFixed(3));
                }
                else{
                    var deltas= parseFloat(((IDC_intput_mA-12.0)*0.0125).toFixed(3));
                }
              }
              else if(bytes[3]==10)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*0.3125).toFixed(3));   
              else if(bytes[3]==11)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*3.125).toFixed(3));   
              else if(bytes[3]==12)
              var deltas= parseFloat(((IDC_intput_mA-4.0)*6.25).toFixed(3));         
            }    
            let voltage= (bytes[0]<<8 | bytes[1])/1000;
            if (voltage >= 3.64) {
              var bat = 3.64
            }
            else if (voltage <= 3.00) {
              var bat = 3.00
            }
            else
             var bat = voltage;
            let battery = parseFloat((((bat-3)*100)/0.64).toFixed(2));


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
                "Deltas": deltas,
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

export { pslbDecoder };


    

    
    
    
    
    
   