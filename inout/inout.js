import schedule from 'node-schedule';
import { insqhour, insvolmen, insqmin, insqliq, inskpi } from './instelpg.js';

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
qhour_rule.minute = 7; //(0-59)
const qhour_job = schedule.scheduleJob(qhour_rule, insqhour);// Schedule the tasks

// Define the volmen schedule
const volmen_rule = new schedule.RecurrenceRule();
volmen_rule.minute = 15; //(0-59)
volmen_rule.hour = 0; //(0-23)
volmen_rule.date = 1; //(1-31)
const volmen_job = schedule.scheduleJob(volmen_rule, insvolmen);// Schedule the tasks

// Define the qmin schedule
const qmin_rule = new schedule.RecurrenceRule();
qmin_rule.minute = 5; //(0-59)
qmin_rule.hour = 9; //(0-23)
const qmin_job = schedule.scheduleJob(qmin_rule, insqmin);// Schedule the tasks

// Define the qliq schedule
const qliq_rule = new schedule.RecurrenceRule();
qliq_rule.minute = 8; //(0-59)
qliq_rule.hour = 9; //(0-23)
const qliq_job = schedule.scheduleJob(qliq_rule, insqliq);// Schedule the tasks

// Define the kpi schedule
const kpi_rule = new schedule.RecurrenceRule();
kpi_rule.minute = 7; //(0-59)
kpi_rule.hour = 9; //(0-23)
const kpi_job = schedule.scheduleJob(kpi_rule, inskpi);// Schedule the tasks

// Cancel the job if needed
// job.cancel();

