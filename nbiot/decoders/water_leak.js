
const wlDecoder = (message) => {
    var bytes = Buffer.from(message, 'hex');
    var hexa = message;
    var decoded = {};
    //decoded.bytes = bytes;
    //decoded.hexa = hexa;
    decoded.IMEI = hexa.substring(1,16);
    switch(bytes[8]){
        case 20:
            decoded.model = "WL03A-NB";
            break;
            default:
            decoded.model = "not identify";
    }
    decoded.version= bytes[9];
    var data = bytes[26] | bytes[25] << 8 | bytes[24] << 16 | bytes[23] << 24;
    data = new Date(data * 1000);
    decoded.data =data.toISOString();
    decoded.battery = (bytes[11] | bytes[10] << 8)/1000
    decoded.signal = bytes[12];
    decoded.alarm = bytes[13];
    decoded.mod = bytes[14];
    decoded.tdc_flag = bytes[15];
    decoded.leak_status = bytes[16];
    decoded.leak_times = bytes[19] | bytes[18] << 8 | bytes[17] << 16;
    decoded.leak_duration = bytes[22] | bytes[21] << 8 | bytes[20] << 16;
    return decoded;
};

export { wlDecoder };