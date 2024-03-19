import schedule from 'node-schedule';
import { insmeters } from './insaqpg.js';



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


// Cancel the job if needed
// job.cancel();
