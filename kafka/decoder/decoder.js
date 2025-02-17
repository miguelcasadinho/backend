import { jsonrepair } from 'jsonrepair';

const kafkaDecoder = async (message) => {
    let decoded = '`' + message + '`';
    try {
        // Apply the replacements to the message
        decoded = decoded.replace('Daily', '')
            .replace(/Daily/g, ',')
            .replace(/Composite_id/g, '')
            .replace(/Payload_consumption/g, '')
            .replace(/Payload_organizationalStructure/g, '')
            .replace(/Payload_measurementPoint/g, '')
            .replace(/Payload_meter/g, '')
            .replace(/Payload_supplypoint/g, '')
            .replace(/Payload_sample/g, '');

        // Repair and parse the JSON string
        let repaired = jsonrepair(decoded);
        let form_decoded = JSON.parse(repaired);
        form_decoded = JSON.parse(form_decoded);

        return {
            device: '8868310',
            date: form_decoded['payload']['sample']['sampleTime'],
            flow: form_decoded['payload']['sample']['value']['integer']*0.001*10,
        }

    } catch (err) {
        console.error(err);
    }
};

const kafkaDecoderVol = async (message) => {
    let decoded = '`' + message + '`';
    try {
        // Apply the replacements to the message
        decoded = decoded.replace('Daily', '')
            .replace(/Daily/g, ',')
            .replace(/Composite_id/g, '')
            .replace(/Payload_consumption/g, '')
            .replace(/Payload_organizationalStructure/g, '')
            .replace(/Payload_measurementPoint/g, '')
            .replace(/Payload_meter/g, '')
            .replace(/Payload_supplypoint/g, '')
            .replace(/Payload_sample/g, '');

        // Repair and parse the JSON string
        let repaired = jsonrepair(decoded);
        let form_decoded = JSON.parse(repaired);
        form_decoded = JSON.parse(form_decoded);

        return {
            device: '8868310',
            date: form_decoded['payload']['sample']['sampleTime'],
            //flow: form_decoded['payload']['sample']['value']['consumption.composed_integer_thousandth_value']['integer'],
            volume: parseFloat((((form_decoded['payload']['sample']['reading']['consumption.composed_integer_thousandth_reading']['integer'])-21880145)*0.001).toFixed(2))
        }

    } catch (err) {
        console.error(err);
    }
};

export { kafkaDecoder, kafkaDecoderVol };