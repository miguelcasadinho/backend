function datalog(i,bytes){
  var aa=(bytes[0+i]&0x08)?"CPL03":"CPL01";
  var bb=(bytes[0+i]&0x20)?"PART":"SUM";
  var cc=(bytes[0+i]&0x10)?"YES":"NO"; 
  var dd=(bytes[0+i]&0x02)?"TRUE":"FALSE"; 
  var ee=(bytes[0+i]&0x01)?"OPEN":"CLOSE";  
  var ff=(bytes[0+i]&0x04)>>2;
  var gg=(bytes[0+i]&0x07);
  var hh=(bytes[1+i]<<16 | bytes[2+i]<<8 | bytes[3+i]).toString(10);
  var ii=(bytes[4+i]<<16 | bytes[5+i]<<8 | bytes[6+i]).toString(10);
  var jj= getMyDate((bytes[7+i]<<24 | bytes[8+i]<<16 | bytes[9+i]<<8 | bytes[10+i]).toString(10));
  var string;
    
  if(aa=="CPL01")
    string='['+aa+','+bb+','+cc+','+dd+','+ee+','+ff+','+hh+','+ii+','+jj+']'+',';  
  else
    string='['+aa+','+bb+','+cc+','+gg+','+hh+','+ii+','+jj+']'+',';  
      
  return string;
};

function getzf(c_num){ 
  if(parseInt(c_num) < 10)
    c_num = '0' + c_num; 
  return c_num; 
};

function getMyDate(str){ 
  var c_Date;
  if(str > 9999999999)
    c_Date = new Date(parseInt(str));
  else 
    c_Date = new Date(parseInt(str) * 1000);
  
  var c_Year = c_Date.getFullYear(), 
  c_Month = c_Date.getMonth()+1, 
  c_Day = c_Date.getDate(),
  c_Hour = c_Date.getHours(), 
  c_Min = c_Date.getMinutes(), 
  c_Sen = c_Date.getSeconds();
  var c_Time = c_Year +'-'+ getzf(c_Month) +'-'+ getzf(c_Day) +' '+ getzf(c_Hour) +':'+ getzf(c_Min) +':'+getzf(c_Sen); 
  
  return c_Time;
};


const cpl03Decoder = (message) => {
  if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
    let bytes = Buffer.from(message.data, 'base64');
    let contador = message.tags.CONTADOR;
    let hastag_id = Object.hasOwnProperty.call(message.tags, 'TAG');
    let leitura_inicial = Number(message.tags.LEITURA_INICIAL);
    let litros_impulso = Number(message.tags.LITROS_IMPULSO);
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

    if (message.fPort == 0x03){
      let data_sum = [];
      for(let i=0;i<bytes.length;i=i+11){
        let data= datalog(i,bytes);
        if(i=='0'){
          data_sum=data;
        }
        else {
          data_sum+=data;
        }
      };

      const array = data_sum.slice(0, -1).split('],[').map(entry => {
        // Remove any brackets and split each entry into a sub-array
        return entry.replace(/[\[\]]/g, '').split(',');
      });

      let in1 = [];
      for (let i = 0; i< array.length; i++){
        in1.push({
          date: new Date(array[i][6]),
          volume: parseFloat(((array[i][4]*litros_impulso*0.001)+leitura_inicial).toFixed(2))
        })
      };

      let payload = {
        "AppID": message.applicationID,
        "Application": message.applicationName,
        "DeviceName": contador,
        "Tag_id": hastag_id ? message.tags.TAG : '',
        "Data": message.data,
        "fPort": message.fPort,
        //"Date": new Date(), 
        "Volume_IN1": in1,
        //"Volume_IN2": ,
        "gateway": gatewayID,
        "rssi": message.rxInfo[index].rssi,
        "snr": message.rxInfo[index].loRaSNR,
        "sf": message.txInfo.loRaModulationInfo.spreadingFactor
      };
      return payload;
    }
    else if (message.fPort == 0x05){
      let sub_band;
      let freq_band;
      let sensor;
      if(bytes[0]==0x20)
        sensor= "CPL03-LB";
      if(bytes[4]==0xff)
        sub_band="NULL";
      else
        sub_band=bytes[4];
      if(bytes[3]==0x01)
        freq_band="EU868";
      else if(bytes[3]==0x02)
        freq_band="US915";
      else if(bytes[3]==0x03)
        freq_band="IN865";
      else if(bytes[3]==0x04)
        freq_band="AU915";
      else if(bytes[3]==0x05)
        freq_band="KZ865";
      else if(bytes[3]==0x06)
        freq_band="RU864";
      else if(bytes[3]==0x07)
        freq_band="AS923";
      else if(bytes[3]==0x08)
        freq_band="AS923_1";
      else if(bytes[3]==0x09)
        freq_band="AS923_2";
      else if(bytes[3]==0x0A)
        freq_band="AS923_3";
      else if(bytes[3]==0x0B)
        freq_band="CN470";
      else if(bytes[3]==0x0C)
        freq_band="EU433";
      else if(bytes[3]==0x0D)
        freq_band="KR920";
      else if(bytes[3]==0x0E)
        freq_band="MA869";
      let firm_ver= (bytes[1]&0x0f)+'.'+(bytes[2]>>4&0x0f)+'.'+(bytes[2]&0x0f);
      let voltage= (bytes[5]<<8 | bytes[6])/1000;
      if (voltage >= 3.64) {
        var bat = 3.64
      }
      else if (voltage <= 3.00) {
        var bat = 3.00
      }
      else
       var bat = voltage;
      let battery = parseFloat((((bat-3)*100)/0.64).toFixed(2));      

      let payload = {
        "AppID": message.applicationID,
        "Application": message.applicationName,
        "DeviceName": contador,
        "Tag_id": hastag_id ? message.tags.TAG : '',
        "Data": message.data,
        "fPort": message.fPort,
        "Date": new Date(),
        "Battery": battery,
        "gateway": gatewayID,
        "rssi": message.rxInfo[index].rssi,
        "snr": message.rxInfo[index].loRaSNR,
        "sf": message.txInfo.loRaModulationInfo.spreadingFactor
      };
      return payload;
    }
      else if (message.fPort == 0x06){
          let work_mod=(bytes[0]&0x08)?"CPL03":"CPL01";
          let count_mod=(bytes[0]&0x20)?"PART":"SUM"; 
          let tdc_interval=(bytes[0]&0x10)?"YES":"NO";   
          let calculate_flag=(bytes[0]&0x07);
          let in1_pulse=bytes[1]<<16 | bytes[2]<<8 | bytes[3];
          let in2_pulse=bytes[4]<<16 | bytes[5]<<8 | bytes[6];
          let in3_pulse=bytes[7]<<16 | bytes[8]<<8 | bytes[9];

          let in1 = [];
          in1.push({
            date: new Date(),
            volume: parseFloat(((in1_pulse*litros_impulso*0.001)+leitura_inicial).toFixed(2))
          });

          let payload = {
              "AppID": message.applicationID,
              "Application": message.applicationName,
              "DeviceName": contador,
              "Tag_id": hastag_id ? message.tags.TAG : '',
              "Data": message.data,
              "fPort": message.fPort,
              //"Date": new Date(), 
              "Volume_IN1": in1,
              //"Volume_IN2": ,
              "gateway": gatewayID,
              "rssi": message.rxInfo[index].rssi,
              "snr": message.rxInfo[index].loRaSNR,
              "sf": message.txInfo.loRaModulationInfo.spreadingFactor
          };
          return payload;
      }
      else {
          return;
      }
  }
}


export { cpl03Decoder };