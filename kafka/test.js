import { jsonrepair } from 'jsonrepair';

let message = `
Daily {
  id: Composite_id {
    eventId: 'a72e746f-04bd-4f0d-9a2b-cf35604d9bda',
    parentId: null,
    correlationId: 'a72e746f-04bd-4f0d-9a2b-cf35604d9bda',
    parentCorrelationIds: [ '4d81d354-1d13-4a39-84ab-c003bea618e4' ]
  },
  created: '2024-05-28T17:11:13.076Z',
  eventType: 'consumption_meter_daily',
  payload: Payload_consumption {
    arrivalTime: '2024-05-28 06:43:34',
    tenantId: '14de1838-d341-4d8e-b6ed-8d17f57c58f6',
    organizationalStructure: Payload_organizationalStructure {
      organizationalStructureId: '13240fcf-a289-4d62-a0bb-3da045b12b58',
      organizationalStructureName: 'EMAS BEJA',
      level1Name: null,
      level2Name: null,
      level3Name: null
    },
    measurementPoint: Payload_measurementPoint {
      measurementPointId: '606ece92af33db001887d2ff',
      description: null,
      alias: null,
      address: null,
      latitude: null,
      longitude: null
    },
    meter: Payload_meter {
      meterId: '2753a41c-1b59-4446-b8b8-7dd08330568b',
      meterSerial: '15547',
      parentDevice: [Payload_parentDevice]
    },
    supplyPoint: Payload_supplypoint {
      sector: null,
      subsector: null,
      distributionNetwork: null,
      billable: 'false'
    },
    sample: Payload_sample {
      value: [Composed_integer_thousandth_value],
      reading: [Composed_integer_thousandth_reading],
      qMax: [Payload_sample_qMax],
      qMin: [Payload_sample_qMin],
      numReadings: 31,
      sampleTime: '2024-05-28T06:30:00.000Z',
      sampleDate: '2024-05-28',
      estimatedValues: [Sample_estimatedValues],
      signalId: '2753a41c-1b59-4446-b8b8-7dd08330568b.consumptionMeterDaily',
      signalName: 'consumptionMeterDaily',
      meterId: '2753a41c-1b59-4446-b8b8-7dd08330568b',
      signalType: 'meter_daily',
      quantity: [Payload_sample_quantity],
      valid: null,
      validity: null,
      origin: [Array],
      metaTags: [Array],
      sampleInfo: null
    }
  }
}

Daily {
  id: Composite_id {
    eventId: 'ac81153a-e37a-4cec-9696-5d7d4f5ce092',
    parentId: null,
    correlationId: 'ac81153a-e37a-4cec-9696-5d7d4f5ce092',
    parentCorrelationIds: [ '0170b869-6c6f-468c-bdbc-2662f0e24a9a' ]
  },
  created: '2024-05-28T17:11:13.076Z',
  eventType: 'consumption_meter_daily',
  payload: Payload_consumption {
    arrivalTime: '2024-05-28 06:43:34',
    tenantId: '14de1838-d341-4d8e-b6ed-8d17f57c58f6',
    organizationalStructure: Payload_organizationalStructure {
      organizationalStructureId: '13240fcf-a289-4d62-a0bb-3da045b12b58',
      organizationalStructureName: 'EMAS BEJA',
      level1Name: null,
      level2Name: null,
      level3Name: null
    },
    measurementPoint: Payload_measurementPoint {
      measurementPointId: '606ece92af33db001887d2ff',
      description: null,
      alias: null,
      address: null,
      latitude: null,
      longitude: null
    },
    meter: Payload_meter {
      meterId: '2753a41c-1b59-4446-b8b8-7dd08330568b',
      meterSerial: '15547',
      parentDevice: [Payload_parentDevice]
    },
    supplyPoint: Payload_supplypoint {
      sector: null,
      subsector: null,
      distributionNetwork: null,
      billable: 'false'
    },
    sample: Payload_sample {
      value: [Composed_integer_thousandth_value],
      reading: [Composed_integer_thousandth_reading],
      qMax: [Payload_sample_qMax],
      qMin: [Payload_sample_qMin],
      numReadings: 96,
      sampleTime: '2024-05-27T22:45:00.000Z',
      sampleDate: '2024-05-27',
      estimatedValues: [Sample_estimatedValues],
      signalId: '2753a41c-1b59-4446-b8b8-7dd08330568b.consumptionMeterDaily',
      signalName: 'consumptionMeterDaily',
      meterId: '2753a41c-1b59-4446-b8b8-7dd08330568b',
      signalType: 'meter_daily',
      quantity: [Payload_sample_quantity],
      valid: null,
      validity: null,
      origin: [Array],
      metaTags: [Array],
      sampleInfo: null
    }
  }
}`;

try {
  let payload = JSON.stringify(message);
  //console.log(payload);

  payload = payload.replace('Daily', '')
    .replace(/Daily/g, ',')
    .replace(/Composite_id/g, '')
    .replace(/Payload_consumption/g, '')
    .replace(/Payload_organizationalStructure/g, '')
    .replace(/Payload_measurementPoint/g, '')
    .replace(/Payload_meter/g, '')
    .replace(/Payload_supplypoint/g, '')
    .replace(/Payload_sample/g, '');
  //console.log(payload);
let repaired = JSON.parse(payload);
console.log(repaired);
   repaired = JSON.parse(jsonrepair(payload));
  console.log(repaired);
  /*
  for (let i=0; i<repaired.length; i++){
    //console.log('sample:', repaired[0].payload.sample);
    console.log(i,'sample_value:', repaired[i].payload.sample.value);
    console.log(i,'sample_reading:', repaired[i].payload.sample.reading);
    console.log(i,'sample_qMax:', repaired[i].payload.sample.qMax);
    console.log(i,'sample_qMin:', repaired[i].payload.sample.qMin);
    console.log(i,'sample_date:', repaired[i].payload.sample.sampleTime);
    console.log(i,'sample_readings:', repaired[i].payload.sample.numReadings);
  }
  */
} catch (err) {
  console.error(err)
}