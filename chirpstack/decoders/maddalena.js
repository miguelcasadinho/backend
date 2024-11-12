const message = {"applicationID":"81","applicationName":"Aguas-Arrow","deviceName":"23929715","devEUI":"eNgAsCOSlxU=","rxInfo":[{"gatewayID":"AA25//9WedQ=","time":"2024-11-09T17:21:27.076490739Z","timeSinceGPSEpoch":null,"rssi":-114,"loRaSNR":0.8,"channel":0,"rfChain":1,"board":0,"antenna":0,"location":{"latitude":38.0138,"longitude":-7.86334,"altitude":311,"source":"UNKNOWN","accuracy":0},"fineTimestampType":"NONE","context":"T6O2Qw==","uplinkID":"6R0nauQCTNaW0NqN4faf+Q==","crcStatus":"CRC_OK"}],"txInfo":{"frequency":868100000,"modulation":"LORA","loRaModulationInfo":{"bandwidth":125,"spreadingFactor":7,"codeRate":"4/5","polarizationInversion":false}},"adr":true,"dr":5,"fCnt":1028,"fPort":1,"data":"2lXCLgQAEwxUhAD6P4QAoAGIAVIB5AH/AMkAwQDDAMkAxwDIAA==","objectJSON":"{}","tags":{"CONTADOR":"000000007262125"},"confirmedUplink":true,"devAddr":"LH4jGA=="};

//const message = {"applicationID":"81","applicationName":"Aguas-Arrow","deviceName":"23929715","devEUI":"eNgAsCOSlxU=","rxInfo":[{"gatewayID":"AA25//9WedQ=","time":"2024-11-09T17:21:28.314723622Z","timeSinceGPSEpoch":null,"rssi":-117,"loRaSNR":-1.2,"channel":0,"rfChain":1,"board":0,"antenna":0,"location":{"latitude":38.0138,"longitude":-7.86334,"altitude":311,"source":"UNKNOWN","accuracy":0},"fineTimestampType":"NONE","context":"T7YlSw==","uplinkID":"IeA1rgwwRC+Rs4u7Kicjag==","crcStatus":"CRC_OK"}],"txInfo":{"frequency":868100000,"modulation":"LORA","loRaModulationInfo":{"bandwidth":125,"spreadingFactor":7,"codeRate":"4/5","polarizationInversion":false}},"adr":true,"dr":5,"fCnt":1029,"fPort":2,"data":"2lXCLgQAEwxUhABYU4QAxwDIAKoAqgDPAMIBxAFlAfUBXwGMBA==","objectJSON":"{}","tags":{"CONTADOR":"000000007262125"},"confirmedUplink":true,"devAddr":"LH4jGA=="};

const arrowDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        const { fPort, data, rxInfo, applicationID, applicationName, tags, txInfo } = message;
        if (fPort === 1 || fPort === 2) {
            const bytes = Buffer.from(data, 'base64');

            // Calculate date based on message timestamp
            let timestamp = (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)) * 1000;
            let date = new Date(timestamp);
            date.setFullYear(date.getFullYear() + 30);  // Add 30 years
            date.setDate(date.getDate() - 2);           // Subtract 1 day

            // Adjust hour based on fPort
            date.setHours(fPort === 1 ? 11 : 23);
            date.setMinutes(0);
            date.setSeconds(0);

            // Decode error flags into alarms
            const error = bytes[4] | (bytes[5] << 8);
            const alarms = [];
            const errorMessages = [
                "Manipulação mecânica", "Manipulação magnética", "Fuga", "Caudal máximo",
                "Fluxo inverso", "Sem consumo", "Meter Reversed IS", "Out Of Operating Temperature",
                null, null, "Bateria fraca", "Bateria fraca", "Expired Sealing Period",
                "Config Set To Default Value", "Metrological Wrong Checksum"
            ];
            errorMessages.forEach((msg, idx) => {
                if (msg && (error >> idx) & 0x01) alarms.push(msg);
            });
            if (alarms.length === 0) alarms.push("No Alarms");

            // Define vif values based on byte[6]
            const vifLookup = [0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000];
            const vif = vifLookup[bytes[6] - 0x10] || 1;

            // Calculate initial and final volume
            const volfin = (bytes[7] | (bytes[8] << 8) | (bytes[9] << 16) | (bytes[10] << 24)) / 1000;
            const volini = (bytes[11] | (bytes[12] << 8) | (bytes[13] << 16) | (bytes[14] << 24)) / 1000;

            // Extract delta values
            const deltas = [];
            for (let i = 15; i < bytes.length; i += 2) {
                deltas.push((bytes[i] | (bytes[i + 1] << 8)) / 1000);
            }

            // Get maximum SNR and corresponding gateway ID
            const snrValues = rxInfo.map(info => info.loRaSNR);
            const maxSNR = Math.max(...snrValues);
            const maxSNRIndex = snrValues.indexOf(maxSNR);
            const gatewayID = Buffer.from(rxInfo[maxSNRIndex].gatewayID, 'base64').toString('hex');


            // Construct payload object
            const payload = {
                AppID: applicationID,
                Application: applicationName,
                DeviceName: tags.CONTADOR,
                Data: data,
                fPort: fPort,
                vif: vif,
                Alarm: alarms,
                Date: date,
                Volume: parseFloat(volini.toFixed(3)),
                Volume_fin: parseFloat(volfin.toFixed(3)),
                Deltas: deltas,
                gateway: gatewayID,
                rssi: rxInfo[maxSNRIndex].rssi,
                snr: maxSNR,
                sf: txInfo.loRaModulationInfo.spreadingFactor,
            };

            //console.log(payload);
            return payload;
        }
    }
};


export { arrowDecoder };



