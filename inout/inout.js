import schedule from 'node-schedule';
import { insqhour, insvolmen, insqmin } from './instelpg.js';

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

// Define the qhour schedule
const qhour_rule = new schedule.RecurrenceRule();
qhour_rule.minute = 10; //(0-59)
const qhour_job = schedule.scheduleJob(qhour_rule, insqhour);// Schedule the tasks

// Define the volmen schedule
const volmen_rule = new schedule.RecurrenceRule();
volmen_rule.minute = 0; //(0-59)
volmen_rule.hour = 15; //(0-23)
volmen_rule.date = 1; //(1-31)
const volmen_job = schedule.scheduleJob(volmen_rule, insvolmen);// Schedule the tasks

// Define the qmin schedule
const qmin_rule = new schedule.RecurrenceRule();
qmin_rule.minute = 4; //(0-59)
qmin_rule.hour = 9; //(0-23)
const qmin_job = schedule.scheduleJob(qmin_rule, insqmin);// Schedule the tasks

// Cancel the job if needed
// job.cancel();

