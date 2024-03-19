import schedule from 'node-schedule';
import { qhourTask } from './qhour.js';

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
qhour_rule.minute = 5; //(0-59)



// Schedule the tasks
const qhour_job = schedule.scheduleJob(qhour_rule, qhourTask);

// Cancel the job if needed
// job.cancel();