import schedule from 'node-schedule';
import { insmeters, insclients, inscoords, insfat, inszerofat, inscontra, insramrua, inszmccontratos, insinfometers, inszmcinfometers, insestimated, insRL, insCrm } from './insaqpg.js';

/*
//schedule rules
const rule = new schedule.RecurrenceRule();
rule.second = 0; //(0-59, OPTIONAL)
rule.minute = 0; //(0-59)
rule.hour = 0; //(0-23)
rule.date = 1; //(1-31)
rule.month = 1; //(1-12)
rule.dayOfWeek = 0; //(0 - 7) (0 or 7 is Sun)
rule.tz = 'Europe/Lisbon';
*/

// Define the insramrua schedule
const ramrua_rule = new schedule.RecurrenceRule();
ramrua_rule.minute =0; //(0-59)
ramrua_rule.hour = 7; //(0-23)
// Schedule the insclientss tasks
const ramrua_job = schedule.scheduleJob(ramrua_rule, insramrua);

// Define the insclients schedule
const clients_rule = new schedule.RecurrenceRule();
clients_rule.minute = 5; //(0-59)
clients_rule.hour = 7; //(0-23)
// Schedule the insclientss tasks
const clients_job = schedule.scheduleJob(clients_rule, insclients);

// Define the inscoords schedule
const coords_rule = new schedule.RecurrenceRule();
coords_rule.minute = 15; //(0-59)
coords_rule.hour = 7; //(0-23)
// Schedule the insclientss tasks
const coords_job = schedule.scheduleJob(coords_rule, inscoords);

// Define the insfat schedule
const fat_rule = new schedule.RecurrenceRule();
fat_rule.minute = 25; //(0-59)
fat_rule.hour = 7; //(0-23)
// Schedule the insclients tasks
const fat_job = schedule.scheduleJob(fat_rule, insfat);

// Define the inszerofat schedule
const zerofat_rule = new schedule.RecurrenceRule();
zerofat_rule.minute = 20; //(0-59)
zerofat_rule.hour = 7; //(0-23)
// Schedule the insclients tasks
const zerofat_job = schedule.scheduleJob(zerofat_rule, inszerofat);

// Define the inscontra schedule
const contra_rule0 = new schedule.RecurrenceRule();
contra_rule0.minute = 30; //(0-59)
contra_rule0.hour = 6; //(0-23)
const contra_rule1 = new schedule.RecurrenceRule();
contra_rule1.minute = 30; //(0-59)
contra_rule1.hour = 12; //(0-23)
const contra_rule2 = new schedule.RecurrenceRule();
contra_rule2.minute = 0; //(0-59)
contra_rule2.hour = 16; //(0-23)
// Schedule the insclientss tasks
const contra_job0 = schedule.scheduleJob(contra_rule0, inscontra);
const contra_job1 = schedule.scheduleJob(contra_rule1, inscontra);
const contra_job2 = schedule.scheduleJob(contra_rule2, inscontra);

// Define the insmeters schedule
const meters_rule0 = new schedule.RecurrenceRule();
meters_rule0.minute = 45; //(0-59)
meters_rule0.hour = 7; //(0-23)
const meters_rule1 = new schedule.RecurrenceRule();
meters_rule1.minute = 35; //(0-59)
meters_rule1.hour = 12; //(0-23)
const meters_rule2 = new schedule.RecurrenceRule();
meters_rule2.minute = 5; //(0-59)
meters_rule2.hour = 16; //(0-23)
// Schedule the insmeters tasks
const meters_job0 = schedule.scheduleJob(meters_rule0, insmeters);
const meters_job1 = schedule.scheduleJob(meters_rule1, insmeters);
const meters_job2 = schedule.scheduleJob(meters_rule2, insmeters);

// Define the zmc contracts schedule
const zmccontratos_rule = new schedule.RecurrenceRule();
zmccontratos_rule.minute = 45; //(0-59)
zmccontratos_rule.hour = 17; //(0-23)
// Schedule the insclients tasks
const zmccontratos_job = schedule.scheduleJob(zmccontratos_rule, inszmccontratos);

// Define the meters data schedule
const infometers_rule = new schedule.RecurrenceRule();
infometers_rule.minute = 40; //(0-59)
infometers_rule.hour = 10; //(0-23)
// Schedule the insclients tasks
const infometers_job = schedule.scheduleJob(infometers_rule, insinfometers);

// Define the zmc meters data schedule
const zmcinfometers_rule = new schedule.RecurrenceRule();
zmcinfometers_rule.minute = 45; //(0-59)
zmcinfometers_rule.hour = 10; //(0-23)
// Schedule the insclients tasks
const zmcinfometers_job = schedule.scheduleJob(zmcinfometers_rule, inszmcinfometers);

// Define the Estimated data schedule
const estimated_rule = new schedule.RecurrenceRule();
estimated_rule.minute = 2; //(0-59)
estimated_rule.hour = 6; //(0-23)
// Schedule the insclients tasks
const estimated_job = schedule.scheduleJob(estimated_rule, insestimated);

// Define the ramais locais data schedule
const rl_rule = new schedule.RecurrenceRule();
rl_rule.minute = 32; //(0-59)
rl_rule.hour = 11; //(0-23)
// Schedule the insclients tasks
const rl_job = schedule.scheduleJob(rl_rule, insRL);

// Define the consumos mes ramal data schedule
const cmr_rule = new schedule.RecurrenceRule();
cmr_rule.minute = 4; //(0-59)
cmr_rule.hour = 7; //(0-23)
cmr_rule.date = 5; //(1-31)
// Schedule the insclients tasks
const cmr_job = schedule.scheduleJob(cmr_rule, insCrm);

// Cancel the job if needed
// job.cancel();

