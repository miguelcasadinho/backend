import axios from 'axios';

async function makeRequest(device, start, end) {
    try {
      const response = await axios.get(`https://flowision.pt/api/deviceDashbord/getLogsDevice?params=%7B%22paramsSearch%22:%7B%22device%22:%22cli006.${device}%22,%22ordFild%22:%22time%22,%22ordSearch%22:%22desc%22,%22pageBegin%22:1,%22pageEnd%22:14,%22dateSearchBegin%22:%22${start}%22,%22dateSearchEnd%22:%22${end}%22,%22alertsActive%22:%22%22%7D,%22tabListInfo%22:%5B%22time%22,%22deltar%22%5D,%22tablist%22:%5B%7B%22tabid%22:4,%22infoconfigid%22:1,%22description%22:%22Grafico%20Consumo%20Hor%C3%A1rio%22,%22tabtype%22:2,%22searchtabdata%22:%22nsHia_tpLogDataReadsWSats%22%7D%5D,%22lenghtTable%22:false,%22cursor%22:%7B%22cursorBollean%22:false,%22cursorName%22:%22fweb_1729242494668%22%7D%7D`);
    // Check if logs exist in the response
      if (!response.data?.logs || response.data.logs.length === 0) {
        throw new Error('No logs found in the API response.');
      }
      
      return response.data.logs[0]._data;
    } catch (error) {
      console.error('Error in makeRequest:', error);
      throw error; // Re-throw error for higher-level handling
    }
  }

async function transformData(data) {
  try {
    // Use Promise.all to ensure that any asynchronous processing can be handled if needed.
    const transformed = await Promise.all(data.map(async ([timestamp, value]) => {
        const date = new Date(timestamp); // Convert timestamp to Date object
        const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19); // Format date as 'YYYY-MM-DD HH:mm:ss'
        return [formattedDate, value]; // Return new array with formatted date and original value
    }));
    return transformed; // Return the transformed data
  } catch (error) {
    console.error('Error in transformData:', error);
    return []; // Return an empty array in case of an error
  }
}

async function flow(device, start, end) {
  try {
    if (!device || !start || !end) {
      throw new Error('Device, start date, and end date are required parameters.');
    }
    const fetch = await makeRequest(device, start, end);
    const records = await transformData(fetch);
    //console.log(records);
    return records;
  } catch (error) {
    console.error('Error in flow:', error.message);
    throw error; // Re-throw error for external handling
  }
}

export {flow};

