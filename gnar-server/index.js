// Get external dependencies
// Get internal dependencies
const crawler = require('./crawler');
const api = require('./api');
const cron = require('cron').CronJob;

/*
* Runs every 10 minutes starting at 8 AM and continuing through the 2 PM hour (till 3:00)
*/
const START_TIME = '00 */05 8-14 * * *';

let job = new cron({
    cronTime: START_TIME,
    onTick: function() {
    	crawler.init();
    },
    start: false,
    timeZone: 'America/Los_Angeles'
});

job.start();