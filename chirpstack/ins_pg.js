import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
import pg from 'pg';

const pool  = new pg.Pool({
    host: process.env.psqlGiggoHost,
    port: process.env.psqlGiggoPort,
    user: process.env.psqlGiggoUser,
    password: process.env.psqlGiggoPassword,
    database: process.env.psqlGiggoDatabase
});

const insertPg = (payload) => {
    var appID = payload.AppID;
    var fPort = payload.fPort;
    switch (appID) {
        case '34':
            insertFlow(payload);
            insertVolume(payload);
            insertAlarm(payload);
            insertCom(payload);
            break;
        case '81':
            if (fPort == 1){
                insertFlowArrow1(payload);
            }
            else if (fPort == 2) {
                insertFlowArrow2(payload);
            }
            insertVolume(payload);
            insertAlarm(payload);
            insertCom(payload);
            break;
        case '119':
            if (fPort == 1){
                insertFlowArrow1(payload);
            }
            else if (fPort == 2) {
                insertFlowArrow2(payload);
            }
            insertVolume(payload);
            insertAlarm(payload);
            insertCom(payload);
            break;
        default:
    }
};

const insertFlow = (payload) => {
    for (var i=0; i < payload.Deltas.length; i++){
        const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
        var data = new Date(payload.Date_log);
        var hour =data.getHours();
        hour=hour+1+i;
        data.setHours(hour);
        var values = [payload.DeviceName, data, payload.Deltas[i]];
        pool.query(query, values, (error, response) => {
            if (error) {
              console.log(error);
            }
        });
    };
};

const insertFlowArrow1 = (payload) => {
    for (var i=0; i < payload.Deltas.length; i++){
        const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
        var data = new Date(payload.Date);
        var hour = data.getHours();
        hour=hour-i;
        data.setHours(hour);
        var values = [payload.DeviceName, data, payload.Deltas[i]];
        pool.query(query, values, (error, response) => {
            if (error) {
              console.log(error);
            }
        });
    };
};

const insertFlowArrow2 = (payload) => {
    var d24 = (payload.Volume_fin - payload.Volume);
    var vol11h;
    var d12;
    //select the volume from 11h
    var data12h = new Date(payload.Date);
    var hour12h = data12h.getHours();
    data12h.setHours(12);
    data12h.setMinutes(0);
    data12h.setSeconds(0);
    var data10h = new Date(data12h);
    var hour10h = data12h.getHours();
    data10h.setHours(hour10h-2);
    var query_11h = {
        name: '11h',
        text: 'SELECT date, volume FROM volume WHERE device = $1 AND (date > $2 and date < $3)',
        values: [payload.DeviceName, data10h, data12h],
    }
    pool.query(query_11h, (error, response) => {
        if (error) {
            console.log(error);
        }
        else {      
            vol11h = parseFloat(response.rows[0].volume);  
        }    
    });
    var vol24h = payload.Volume_fin;
    var cons13_23 = 0;
    for (var i = 0; i < payload.Deltas.length; i++){
        cons13_23 = cons13_23 + payload.Deltas[i];
    }
    setTimeout(function() {
        d12 = ((vol24h-vol11h) - (cons13_23 + d24));
            if (d12 < 0){
                d12 = 0
            };   
    }, 500);
    
    setTimeout(function() {
        //inserting the data
        for (i=0; i < payload.Deltas.length; i++){
            const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
            var data = new Date(payload.Date);
            var hour = data.getHours();
            hour=hour-i;
            data.setHours(hour);
            var values = [payload.DeviceName, data, payload.Deltas[i]];
            pool.query(query, values, (error, response) => {
                if (error) {
                    console.log(error);
                };
            });
        };
        const query_d12 = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
        var data12h = new Date(payload.Date);
        var hour12h = data12h.getHours();
        data12h.setHours(12);
        data12h.setMinutes(0);
        data12h.setSeconds(0);
        values = [payload.DeviceName, data12h, d12];
        pool.query(query_d12, values, (error, response) => {
            if (error) {
                console.log(error);
            };
        });
        const query_d24 = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
        var data24h = new Date(payload.Date);
        var hour24h = data24h.getHours();
        data24h.setHours(0);
        data24h.setMinutes(0);
        data24h.setSeconds(0);
        values = [payload.DeviceName, data24h, d24];
        pool.query(query_d24, values, (error, response) => {
            if (error) {
                console.log(error);
            };
        });   
    }, 1000);
};

const insertVolume = (payload) => {
    const query_vol = `INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`;
    var values = [payload.DeviceName, payload.Date, payload.Volume];
    pool.query(query_vol, values, (error, response) => {
        if (error) {
            console.log(error);
        }
    });
};

const insertAlarm = (payload) => {
    if (payload.Alarm.length == 1) {
        var alarm = payload.Alarm[0];
    }
    else if (payload.Alarm.length == 2) {
        var alarm = payload.Alarm[0] +', '+ payload.Alarm[1];
    }
    else if (payload.Alarm.length == 3) {
        var alarm = payload.Alarm[0] +', '+ payload.Alarm[1] +', '+ payload.Alarm[2];
    }
    else if (payload.Alarm.length == 4) {
        var alarm = payload.Alarm[0] +', '+ payload.Alarm[1] +', '+ payload.Alarm[2] +', '+ payload.Alarm[3];
    }
    else {
        var alarm = payload.Alarm
    };
    const query_alarm = `INSERT INTO alarm(device, date, alarm) VALUES($1, $2, $3)`;
    var values = [payload.DeviceName, payload.Date, alarm];
    pool.query(query_alarm, values, (error, response) => {
        if (error) {
            console.log(error);
        }
    });
};

const insertCom = (payload) => {
    const query_trans = `INSERT INTO transmission(gateway,device, date, rssi, snr, sf) VALUES($1, $2, $3, $4, $5, $6)`;
    var data_tr = new Date();
    var values = [payload.gateway, payload.DeviceName, data_tr, payload.rssi, payload.snr, payload.sf];
    pool.query(query_trans, values, (error, response) => {
        if (error) {
            console.log(error);
        }
    });
};

export { insertPg };  





    
