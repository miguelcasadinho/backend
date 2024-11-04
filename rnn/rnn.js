import schedule from 'node-schedule';
import { runZa1Scripts, runZa1msmScripts, runZa2Scripts, runZa3Scripts, runZa4Scripts, runZa5Scripts,
    runZb1mvScripts
 } from './python.js';

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

// Define the za1 schedule
const za1_rule = new schedule.RecurrenceRule();
za1_rule.minute = 1; //(0-59)
za1_rule.hour = 1; //(0-23)
const za1_job = schedule.scheduleJob(za1_rule, runZa1Scripts);// Schedule the tasks

// Define the za1msm schedule
const za1msm_rule = new schedule.RecurrenceRule();
za1msm_rule.minute = 45; //(0-59)
za1msm_rule.hour = 8; //(0-23)
const za1msm_job = schedule.scheduleJob(za1msm_rule, runZa1msmScripts);// Schedule the tasks

// Define the za2 schedule
const za2_rule = new schedule.RecurrenceRule();
za2_rule.minute = 3; //(0-59)
za2_rule.hour = 1; //(0-23)
const za2_job = schedule.scheduleJob(za2_rule, runZa2Scripts);// Schedule the tasks

// Define the za3 schedule
const za3_rule = new schedule.RecurrenceRule();
za3_rule.minute = 5; //(0-59)
za3_rule.hour = 1; //(0-23)
const za3_job = schedule.scheduleJob(za3_rule, runZa3Scripts);// Schedule the tasks

// Define the za4 schedule
const za4_rule = new schedule.RecurrenceRule();
za4_rule.minute = 7; //(0-59)
za4_rule.hour = 1; //(0-23)
const za4_job = schedule.scheduleJob(za4_rule, runZa4Scripts);// Schedule the tasks

// Define the za5 schedule
const za5_rule = new schedule.RecurrenceRule();
za5_rule.minute = 9; //(0-59)
za5_rule.hour = 1; //(0-23)
const za5_job = schedule.scheduleJob(za5_rule, runZa5Scripts);// Schedule the tasks

// Define the zb1mv schedule
const zb1mv_rule = new schedule.RecurrenceRule();
zb1mv_rule.minute = 30; //(0-59)
zb1mv_rule.hour = 1; //(0-23)
const zb1mv_job = schedule.scheduleJob(zb1mv_rule, runZb1mvScripts);// Schedule the tasks