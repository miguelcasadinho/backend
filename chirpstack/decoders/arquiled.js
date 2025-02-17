const arquiledDecoder = (message) => {
    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        let bytes = Buffer.from(message.data, 'base64');

        if ( ((bytes[1] >> 6) & 0x03) == 0 && (bytes[0] & 0x1F) == 1 ){

            let classe = (bytes[1] >> 6) & 0x03; 
            let subclasse = bytes[0] & 0x1F;
            let versaoHeader = (bytes[0] >> 5) & 0x07; 
            let versaoMensagem = bytes[1] & 0x3F;
            let bat = (bytes[3] >> 4) & 0x0F;
            let battery;

            switch(bat){
                case 0:
                    battery = 100;
                    break;
                case 1:
                    battery = 93.75;
                    break;
                case 2:
                    battery = 87.5;
                    break;
                case 3:
                    battery = 81.25;
                    break;
                case 4:
                    battery = 75;
                    break;
                case 5:
                    battery = 68.75;
                    break;
                case 6:
                    battery = 62.5;
                    break;
                case 7:
                    battery = 56.25;
                    break;
                case 8:
                    battery = 50
                    break;
                case 9:
                    battery = 43.75;
                    break;
                case 10:
                    battery = 37.5;
                    break;
                case 11:
                    battery = 31.25;
                    break;
                case 12:
                    battery = 25;
                    break;
                case 13:
                    battery = 18.75;
                    break;
                case 14:
                    battery = 12.5;
                    break;
                case 15:
                    battery = 6.25;
                    break;
                default:
                    battery = 0;
            }

            let alarms = (bytes[3] & 0x0F);
            let alarm;

            switch(alarms){
                case 0:
                    alarm = "Sem Alarmes";
                    break;
                case 1:
                    alarm = "Tamper";
                    break;
                case 2:
                    alarm = "Remoção";
                    break;
                case 3:
                    alarm = "Corte do cabo";
                    break;
                case 4:
                    alarm = "Fluxo reverso";
                    break;
                case 5:
                    alarm = "Medidor bloqueado";
                    break;
                case 6:
                    alarm = "Vazamento direto";
                    break;
                case 7:
                    alarm = "Vazamento reverso";
                    break;
                case 8:
                    alarm = "Aviso de Direção por cabo";
                    break;
                default:
                    alarm = "Sem Alarmes";
            }

            let temperature = bytes[4];
            let volume = (bytes[8] | bytes[7] << 8 | bytes[6] << 16 | bytes[5] << 24) ;
            let volumeInv = (bytes[11] | bytes[10] << 8 | bytes[9] << 16) ;
            let readingPeriod = bytes[12];
            let date = new Date();

            let deltas = [];
            for (let i=13;i<37;i++) {
                deltas[i-13] = bytes[i];
            }

            let multiply = [];
            let j=0;
            for (let i=37;i<43;i++) {
                switch(bytes[i] & 0x03){
                    case 0:
                        multiply[j] = 1;
                    break;
                    case 1:
                        multiply[j] = 10;
                    break;
                    case 0x10:
                        multiply[j] = 100;
                    break;
                    case 0x11:
                        multiply[j] = -1;
                    break;
                    default:
                        multiply[j] = 0;
                }
                j++;
                switch(bytes[i] >> 2 & 0x03){
                    case 0:
                        multiply[j] = 1;
                    break;
                    case 1:
                        multiply[j] = 10;
                    break;
                    case 0x10:
                        multiply[j] = 100;
                    break;
                    case 0x11:
                        multiply[j] = -1;
                    break;
                    default:
                        multiply[j] = 0;
                }
                j++;
                switch(bytes[i] >> 4 & 0x03){
                    case 0:
                        multiply[j] = 1;
                    break;
                    case 1:
                        multiply[j] = 10;
                    break;
                    case 0x10:
                        multiply[j] = 100;
                    break;
                    case 0x11:
                        multiply[j] = -1;
                    break;
                    default:
                        multiply[j] = 0;
                }
                j++;
                switch(bytes[i] >> 6 & 0x03){
                    case 0:
                        multiply[j] = 1;
                    break;
                    case 1:
                        multiply[j] = 10;
                    break;
                    case 0x10:
                        multiply[j] = 100;
                    break;
                    case 0x11:
                        multiply[j] = -1;
                    break;
                    default:
                        multiply[j] = 0;
                }
                j++;
            }

            let diff = [];
            for (let i=0;i<deltas.length;i++) {
                diff[i] = deltas[i]*multiply[i]*0.001;
            }

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

            let payload = {
                "AppID": message.applicationID,
                "Application": message.applicationName,
                "DeviceName": message.tags.CONTADOR,
                "Data": message.data,
                "fPort": message.fPort,
                "Classe": classe,
                "SubClasse": subclasse,
                "VersaoHeader": versaoHeader,
                "VersaoMensagem": versaoMensagem,
                "Date": date, 
                "Volume": parseFloat(((volume*0.001)+leitura_inicial).toFixed(2)),
                "VolumeIN": parseFloat((volumeInv*0.001).toFixed(2)),
                "Deltas": diff,
                "Alarm": alarm,
                "ReadMode": readingPeriod,
                "Battery": battery,
                "Temperature": temperature,
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            return payload;

        }
    }
};

export { arquiledDecoder };

