import schedule from 'node-schedule';
import { insreso, insgeoreq } from './insnvpg.js';

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

// Define the request service orders schedule
const reso_rule = new schedule.RecurrenceRule();
reso_rule.minute = 25; //(0-59)
reso_rule.hour = 7; //(0-23)
// Schedule the insclientss tasks
const reso_job = schedule.scheduleJob(reso_rule, insreso);

// Define the geo request schedule
const georeq_rule1 = new schedule.RecurrenceRule();
georeq_rule1.minute = 15; //(0-59)
georeq_rule1.hour = 7; //(0-23)
const georeq_rule2 = new schedule.RecurrenceRule();
georeq_rule2.minute = 15; //(0-59)
georeq_rule2.hour = 13; //(0-23)
const georeq_rule3 = new schedule.RecurrenceRule();
georeq_rule3.minute = 15; //(0-59)
georeq_rule3.hour = 19; //(0-23)
// Schedule the insclientss tasks
const georeq_job1 = schedule.scheduleJob(georeq_rule1, insgeoreq);
const georeq_job2 = schedule.scheduleJob(georeq_rule2, insgeoreq);
const georeq_job3 = schedule.scheduleJob(georeq_rule3, insgeoreq);