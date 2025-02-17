import schedule from 'node-schedule';
import { disunauth, diszerogc, diszeroregas, disfalhas4h, disrequest, disasbestos, disdpeirq, disLastSeen7days, disNeverSeen, disLeak } from './dispatch.js';
import { leakTask } from './class/leak.js';
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

// Define the unautorized schedule
const unauth_rule = new schedule.RecurrenceRule();
unauth_rule.minute = 25; //(0-59)
// Schedule the insclientss tasks
const unauth_job = schedule.scheduleJob(unauth_rule, disunauth);

// Define the zeros gc schedule
const zerogc_rule = new schedule.RecurrenceRule();
zerogc_rule.minute = 24; //(0-59)
zerogc_rule.hour = 8; //(0-23)
zerogc_rule.dayOfWeek = 4; //(0 - 7) (0 or 7 is Sun)
// Schedule the insclientss tasks
const zerogc_job = schedule.scheduleJob(zerogc_rule, diszerogc);

// Define the zeros regas schedule
const zeroregas_rule = new schedule.RecurrenceRule();
zeroregas_rule.minute = 30; //(0-59)
zeroregas_rule.hour = 8; //(0-23)
zeroregas_rule.dayOfWeek = 2; //(0 - 7) (0 or 7 is Sun)
// Schedule the insclientss tasks
const zeroregas_job = schedule.scheduleJob(zeroregas_rule, diszeroregas);

// Define the 4h failures schedule
const falhas4h_rule = new schedule.RecurrenceRule();
falhas4h_rule.minute = 59; //(0-59)
falhas4h_rule.hour = 7; //(0-23)
// Schedule the insclientss tasks
const falhas4h_job = schedule.scheduleJob(falhas4h_rule, disfalhas4h);

// Define the requests schedule
const requests_rule = new schedule.RecurrenceRule();
requests_rule.second = 0; //(0-59, OPTIONAL)
// Schedule the insclientss tasks
const requests_job = schedule.scheduleJob(requests_rule, disrequest);


// Define the asbestos schedule
const asbestos_rule = new schedule.RecurrenceRule();
asbestos_rule.minute = 35; //(0-59)
asbestos_rule.hour = 8; //(0-23)
// Schedule the insclientss tasks
const asbestos_job = schedule.scheduleJob(asbestos_rule, disasbestos);


// Define the dpei requests schedule
const dpeirq_rule = new schedule.RecurrenceRule();
dpeirq_rule.minute = 15; //(0-59)
dpeirq_rule.hour = 7; //(0-23)
// Schedule the insclientss tasks
const dpeirq_job = schedule.scheduleJob(dpeirq_rule, disdpeirq);

// Define the last seen 7 days schedule
const ls7days_rule = new schedule.RecurrenceRule();
ls7days_rule.minute = 25; //(0-59)
ls7days_rule.hour = 8; //(0-23)
ls7days_rule.dayOfWeek = 1; //(0 - 7) (0 or 7 is Sun)
// Schedule the insclientss tasks
const ls7days_job = schedule.scheduleJob(ls7days_rule, disLastSeen7days);

// Define the never seen schedule
const neverseen_rule = new schedule.RecurrenceRule();
neverseen_rule.minute = 24; //(0-59)
neverseen_rule.hour = 8; //(0-23)
neverseen_rule.dayOfWeek = 1; //(0 - 7) (0 or 7 is Sun)
// Schedule the insclientss tasks
const neverseen_job = schedule.scheduleJob(neverseen_rule, disNeverSeen);

// Define the leak requests schedule
const leak_rule = new schedule.RecurrenceRule();
leak_rule.minute = 14; //(0-59)
leak_rule.hour = 7; //(0-23)
// Schedule the leak tasks
const leak_job = schedule.scheduleJob(leak_rule, disLeak);