import schedule from 'node-schedule';
import { disreadings } from './dispatch.js';
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

// Define the readings schedule
const readings_rule = new schedule.RecurrenceRule();
readings_rule.minute = 24; //(0-59)
readings_rule.hour = 7; //(0-23)
readings_rule.date = 10; //(1-31)
// Schedule the readings tasks
const readings_job = schedule.scheduleJob(readings_rule, disreadings);

const readings_rule1 = new schedule.RecurrenceRule();
readings_rule1.minute = 24; //(0-59)
readings_rule1.hour = 7; //(0-23)
readings_rule1.date = 17; //(1-31)
// Schedule the readings tasks
const readings_job1 = schedule.scheduleJob(readings_rule1, disreadings);

const readings_rule2 = new schedule.RecurrenceRule();
readings_rule2.minute = 24; //(0-59)
readings_rule2.hour = 7; //(0-23)
readings_rule2.date = 24; //(1-31)
// Schedule the readings tasks
const readings_job2 = schedule.scheduleJob(readings_rule2, disreadings);

const readings_rule3 = new schedule.RecurrenceRule();
readings_rule3.minute = 24; //(0-59)
readings_rule3.hour = 7; //(0-23)
readings_rule3.date = 31; //(1-31)
// Schedule the readings tasks
const readings_job3 = schedule.scheduleJob(readings_rule3, disreadings);