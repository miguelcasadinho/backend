import schedule from 'node-schedule';
import { insmeters, insclients, inscoords, insfat, inscontra, insramrua } from './insaqpg.js';

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

// Define the insmeters schedule
const meters_rule0 = new schedule.RecurrenceRule();
meters_rule0.minute = 0; //(0-59)
meters_rule0.hour = 11; //(0-23)
const meters_rule1 = new schedule.RecurrenceRule();
meters_rule1.minute = 0; //(0-59)
meters_rule1.hour = 17; //(0-23)
// Schedule the insmeters tasks
const meters_job0 = schedule.scheduleJob(meters_rule0, insmeters);
const meters_job1 = schedule.scheduleJob(meters_rule1, insmeters);

// Define the insclients schedule
const clients_rule = new schedule.RecurrenceRule();
clients_rule.minute = 10; //(0-59)
clients_rule.hour = 16; //(0-23)
// Schedule the insclientss tasks
const clients_job = schedule.scheduleJob(clients_rule, insclients);

// Define the inscoords schedule
const coords_rule = new schedule.RecurrenceRule();
coords_rule.minute = 25; //(0-59)
coords_rule.hour = 16; //(0-23)
// Schedule the insclientss tasks
const coords_job = schedule.scheduleJob(coords_rule, inscoords);

// Define the insfat schedule
const fat_rule = new schedule.RecurrenceRule();
fat_rule.minute = 0; //(0-59)
fat_rule.hour = 18; //(0-23)
// Schedule the insclientss tasks
const fat_job = schedule.scheduleJob(fat_rule, insfat);

// Define the inscontra schedule
const contra_rule = new schedule.RecurrenceRule();
contra_rule.minute = 30; //(0-59)
contra_rule.hour = 16; //(0-23)
// Schedule the insclientss tasks
const contra_job = schedule.scheduleJob(contra_rule, inscontra);

// Define the inscontra schedule
const ramrua_rule = new schedule.RecurrenceRule();
ramrua_rule.minute = 13; //(0-59)
ramrua_rule.hour = 18; //(0-23)
// Schedule the insclientss tasks
const ramrua_job = schedule.scheduleJob(ramrua_rule, insramrua);

// Cancel the job if needed
// job.cancel();

