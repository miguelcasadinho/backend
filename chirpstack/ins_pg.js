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
        case '39':
            insertFlowNke(payload);
            insertVolumeNke(payload);
            insertBattery(payload);
            insertCom(payload);
            break;
        case '42':
            insertFlowArrow1(payload);
            insertVolume(payload);
            insertAlarm(payload);
            insertBattery(payload);
            insertCom(payload);
            break;
        case '45':
            insertFlowArrow1(payload);
            insertVolume(payload);
            insertAlarm(payload);
            insertCom(payload);
            break;
        case '80':
            insertFlowArrow1(payload);
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
        case '82':
            insertFlowJanz2(payload);
            insertVolume(payload);
            insertAlarm(payload);
            insertBattery(payload);
            insertCom(payload);
            break;
        case '83':
            insertFlowDiehl(payload);
            insertVolumeDiehl(payload);
            insertAlarm(payload);
            insertCom(payload);
            break;
        case '84':
            insertSensecap(payload);
            insertCom(payload);
            break;
        case '85':
            insertPslb(payload);
            insertCom(payload);
            break;
        case '86':
            insertLdds75(payload);
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
        const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`;
        var data = new Date(payload.Date_log);
        var hour =data.getHours();
        hour=hour+1+i;
        data.setHours(hour);
        var values = [payload.DeviceName, data, payload.Deltas[i]];
        pool.query(query, values, (error, response) => {
            if (error) {
              console.log(error);
            };
        });
    };
};

const insertFlowDiehl = (payload) => {
    for (var i=0; i < payload.Deltas.length; i++){
        const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`;
        var data = new Date(payload.Datelog);
        var hour = data.getHours();
        hour=hour+i;
        data.setHours(hour);
        var values = [payload.DeviceName, data, payload.Deltas[i]*0.001];
        pool.query(query, values, (error, response) => {
            if (error) {
              console.log(error);
            };
        });
    };
};

const insertFlowJanz2 = (payload) => {
    for (var i=0; i < payload.Deltas.length; i++){
        const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
        var data = new Date(payload.Date);
        if (payload.Index == '12h00 to 00h00'){
            data.setHours(0);
            data.setMinutes(0);
            data.setSeconds(0);
        };
        if (payload.Index == '00h00 to 12h00'){
            data.setHours(12);
            data.setMinutes(0);
            data.setSeconds(0);
        };
        var hour = data.getHours();
        hour = hour-i;
        data.setHours(hour);
        var values = [payload.DeviceName, data, payload.Deltas[i]*0.001];
        pool.query(query, values, (error, response) => {
            if (error) {
            console.log(error);
            };
        });
    };
};

const insertFlowArrow1 = (payload) => {
    for (var i=0; i < payload.Deltas.length; i++){
        const query = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3) ON CONFLICT (device, date) DO NOTHING`;
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

const insertFlowNke = (payload) => {
    //inserting the aux data
    if (payload.index1.length > 0) { 
        for (var i=0; i < payload.index1.length; i++){
            var query_index1 = `INSERT INTO nkeaux(device, date, flow) VALUES($1, $2, $3)`;
            var values = [payload.index1[i].device, payload.index1[i].date, payload.index1[i].flow];
            pool.query(query_index1, values, (error, response) => {
                if (error) {
                    console.log(error);
                };
            });
        };
    };
    if (payload.index2.length > 0) { 
        for (var i=0; i < payload.index2.length; i++){
            var query_index2 = `INSERT INTO nkeauxinv(device, date, flow) VALUES($1, $2, $3)`;
            var values = [payload.index2[i].device, payload.index2[i].date, payload.index2[i].flow_inv];
            pool.query(query_index2, values, (error, response) => {
                if (error) {
                    console.log(error);
                };
            });
        };
    };

    //Get the aux data
    var flow;
    var flow_inv;
    if (payload.index1.length > 0) {
        var data = new Date(payload.index1[0].date);
        var hour =data.getHours();
        hour=hour-2;
        data.setHours(hour);
        var query_index1 = {
            name: 'index1-partial',
            text: 'SELECT device, date, flow - lag(flow) over (order by date) as flow, pg_sleep(1) FROM nkeaux WHERE device = $1 AND date >= $2',
            values: [payload.index1[0].device, data],
        };
        setTimeout(() => {
            pool.query(query_index1, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    flow = res.rows
                    // console.log(flow)
                    //inserting the data
                    for (var i=0; i < flow.length; i++){
                        const q1 = `INSERT INTO flow(device, date, flow) VALUES($1, $2, $3)`;
                        var values = [flow[i].device, flow[i].date, flow[i].flow];
                        pool.query(q1, values, (error, response) => {
                            if (error) {
                                console.log(error);
                            };
                        });
                    };
                };
            });
        }, 2000);
    };
    if (payload.index2.length > 0) {
        var data_inv = new Date(payload.index2[0].date);
        var hour_inv = data_inv.getHours();
        hour_inv=hour_inv-2;
        data_inv.setHours(hour_inv);        
        var query_index2 = {
            name: 'index2-partial',
            text: 'SELECT device, date, flow - lag(flow) over (order by date) as flow, pg_sleep(3) FROM nkeauxinv WHERE device = $1 AND date >= $2',
            values: [payload.index2[0].device, data_inv],
        };
        setTimeout(() => {
            pool.query(query_index2, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    flow_inv = res.rows
                    //console.log(flow_inv)
                    //inserting the data
                    for (var i=0; i < flow_inv.length; i++){
                        const q2 = `INSERT INTO flow_inv(device, date, flow) VALUES($1, $2, $3)`;
                        var values = [flow_inv[i].device, flow[i].date, flow_inv[i].flow];
                        pool.query(q2, values, (error, response) => {
                            if (error) {
                                console.log(error);
                            };
                        });
                    };
                };
            });
        }, 4000);
    };
};

const insertVolumeNke = (payload) => {
    if (payload.index1.length > 0) {
        const query_vol = `INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`;
        var values = [payload.DeviceName, payload.Date, payload.Volume];
        pool.query(query_vol, values, (error, response) => {
            if (error) {
                console.log(error);
            };
        });
    };
    if (payload.index2.length > 0) {
        const query_vol_in = `INSERT INTO volume_inv(device, date, volume) VALUES($1, $2, $3)`;
        values = [payload.DeviceName, payload.Date, payload.Volume_inv];
        pool.query(query_vol_in, values, (error, response) => {
            if (error) {
                console.log(error);
            };
        });
    };
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

const insertVolumeDiehl = (payload) => {
    const query_vol = `INSERT INTO volume(device, date, volume) VALUES($1, $2, $3)`;
        var datavol = new Date(payload.Date);
        datavol.setHours(0);
        datavol.setMinutes(0);
        datavol.setSeconds(0);
        datavol.setMilliseconds(0);
        var values = [payload.DeviceName, datavol, payload.Volume];
        pool.query(query_vol, values, (error, response) => {
            if (error) {
                console.log(error);
            };
        });
};

const insertAlarm = (payload) => {
    if (Array.isArray(payload.Alarm)) {
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

const insertBattery = (payload) => {
    const query_bat = `INSERT INTO battery(device, date, battery) VALUES($1, $2, $3)`;
    var values = [payload.DeviceName, payload.Date, payload.Battery];
    pool.query(query_bat, values, (error, response) => {
        if (error) {
            console.log(error);
        };
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

const insertPslb = (payload) => {
    const query = `INSERT INTO pressure(device, date, pressure, battery, lat, lon) VALUES($1, $2, $3, $4, $5, $6)`;
    var values = [payload.DeviceName, payload.Date, payload.Deltas*10, payload.Battery, payload.Lat, payload.Lon];
    pool.query(query, values, (error, response) => {
        if (error) {
            console.log(error);
        };
    });
};

const insertLdds75 = (payload) => {
    const query = `INSERT INTO ldds75(device, date, battery, distance, lat, lon) VALUES($1, $2, $3, $4, $5, $6)`;
    var values = [payload.DeviceName, payload.Date, payload.Battery, payload.Distance, payload.Lat, payload.Lon];
    pool.query(query, values, (error, response) => {
        if (error) {
            console.log(error);
        };
    });
};

const insertSensecap = (payload) => {
    const query = `INSERT INTO weather(device, date, air_temperature, air_humidity, light_intensity, uv_index, wind_speed, wind_direction, rain_gauge, barometric_pressure)
               VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    var values = [payload.DeviceName, payload.Date, payload.air_temperature, payload.air_humidity, payload.light_intensity, payload.uv_index, payload.wind_speed, payload.wind_direction, payload.rain_gauge, payload.barometric_pressure];
    pool.query(query, values, (error, response) => {
        if (error) {
            console.log(error);
        };
    });
};

export { insertPg };  





    
