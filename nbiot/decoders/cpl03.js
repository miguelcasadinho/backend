import { devices } from './devices.js';

const cpl03Decoder = (message) => {
    try {
        let bytes = Buffer.from(message, 'hex');
        let hexa = message;
        let decoded = {};
        //decoded.bytes = bytes;
        //decoded.hexa = hexa;
        decoded.IMEI = hexa.substring(1,16);
        for (const device of devices) {
            const { imei, pulse, meter, vol_ini, lit_pul, report, rph } = device;
            if ( imei === decoded.IMEI){
                decoded.pulse = pulse;
                decoded.device = meter;
                decoded.vol_ini = vol_ini;
                decoded.lit_pul = lit_pul;
                decoded.report = report;
                decoded.rph = rph
            }

        }
        switch(bytes[8]){
            case 0x00:
                decoded.model = "CPL03-NB";
                break;
            default:
                decoded.model = "not identify";
        }
        decoded.version= bytes[9]*0.01;
        decoded.battery = (bytes[11] | bytes[10] << 8)/1000;
        if (decoded.battery >= 3.64) {
            var bat = 3.64
          }
          else if (decoded.battery <= 3.00) {
            var bat = 3.00
          }
          else
          var bat = decoded.battery;
          decoded.battery = parseFloat((((bat-3)*100)/0.64).toFixed(2));
        decoded.signal = bytes[12];
        let samples = ((bytes.length)-13)/14;
        let offset = 13;
        var deltasVol = [];
        for (let i=0; i<(samples); i++) {
            deltasVol.push({
            pa8_status: bytes[offset],
            index1: (bytes[offset+3] | bytes[offset+2] << 8 | bytes[offset+1] << 16),
            index2: (bytes[offset+6] | bytes[offset+5] << 8 | bytes[offset+4] << 16),
            index3: (bytes[offset+9] | bytes[offset+8] << 8 | bytes[offset+7] << 16),
            date: new Date((bytes[offset+13] | bytes[offset+12] << 8 | bytes[offset+11] << 16 | bytes[offset+10] << 24)*1000)
            })
        offset+=14;
        }
        //decoded.deltasVol = deltasVol;
        if (decoded.pulse === 1){
            decoded.volume = parseFloat(((((deltasVol[1].index1)*decoded.lit_pul)*0.001)+decoded.vol_ini).toFixed(2));
        }
        else if (decoded.pulse === 2){
            decoded.volume = parseFloat(((((deltasVol[1].index2)*decoded.lit_pul)*0.001)+decoded.vol_ini).toFixed(2));
        }
        else if (decoded.pulse === 3){
            decoded.volume = parseFloat(((((deltasVol[1].index3)*decoded.lit_pul)*0.001)+decoded.vol_ini).toFixed(2));
        };

        var deltas = [];
        for (let j=1; j<deltasVol.length -1; j++){
            if (decoded.pulse === 1){
                deltas.push({
                    date: deltasVol[j].date,
                    flow: parseFloat((((deltasVol[j].index1*decoded.lit_pul*0.001) - (deltasVol[j+1].index1*decoded.lit_pul*0.001))*decoded.rph).toFixed(3))
                });
            }
            else if (decoded.pulse === 2){
                deltas.push({
                    date: deltasVol[j].date,
                    flow: parseFloat((((deltasVol[j].index2*decoded.lit_pul*0.001) - (deltasVol[j+1].index2*decoded.lit_pul*0.001))*decoded.rph).toFixed(3))
                });
            }
            else if (decoded.pulse === 3){
                deltas.push({
                    date: deltasVol[j].date,
                    flow: parseFloat((((deltasVol[j].index3*decoded.lit_pul*0.001) - (deltasVol[j+1].index3*decoded.lit_pul*0.001))*decoded.rph).toFixed(3))
                });
            } 
        };
        decoded.deltas = deltas;

        return decoded;
    } catch (error) {
        console.error("Error decoding message:", error);
        return null;
    }
};

export { cpl03Decoder };
