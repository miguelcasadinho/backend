import schedule from 'node-schedule';
import { instub_ram } from './insgispg.js';

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
const tub_ram_rule = new schedule.RecurrenceRule();
tub_ram_rule.minute =0; //(0-59)
tub_ram_rule.hour = 5; //(0-23)
tub_ram_rule.date = 1; //(1-31)
// Schedule the insclientss tasks
const tub_ram_job = schedule.scheduleJob(tub_ram_rule, instub_ram);

// Cancel the job if needed
// job.cancel();
