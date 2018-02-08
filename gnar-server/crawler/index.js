const request = require("request");
const fs = require('fs');
const redis = require('redis');
const moment = require('moment');
const cheerio = require("cheerio");
const Nexmo = require('nexmo');
const promise = require("bluebird");

const { Users, Alerts } = require('../database');

const NEXMO_API_KEY = fs.readFileSync('/run/secrets/nexmo-key', 'utf-8');
const NEXMO_API_SECRET = fs.readFileSync('/run/secrets/nexmo-secret', 'utf-8');
const NEXMO_OPTIONS = { debug: false };
const NEXMO_FROM = '15412490080';

const STATUS_MAP = {
  'icon-status-closed' : 'closed',
  'icon-status-scheduled' : 'scheduled',
  'icon-status-open' : 'open',
  'icon-status-hold' : 'on hold'
};

// todo make use of redis for storing lift states
var redisClient = redis.createClient('6379', 'redis');
redisClient.on('error', (error) => {
  console.log(error);
});
// redisClient.flushdb( (err, succeeded) => {
//   console.log('redis mem flush'); // will be true if successfull
// });

let nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET
}, NEXMO_OPTIONS);

module.exports.init = function(){
    let alerts = new Alerts();
    let query = { date: moment().format('MMDDYYYY') };
    alerts.getAlerts(query)
        .then( alerts => {
            if(alerts.length > 0){
                crawl(alerts);
            }
        }, err => {
            console.log(err);
            return;
        });
}

function crawl(alerts){
  request({
    uri: "https://www.mtbachelor.com/conditions-report/",
  }, (error, response, body) => {
    if(error){ console.log(error); return; }
    let $ = cheerio.load(body);
    let lifts = $('.tab1').find('.list-lifts').children();
    let date = moment().format('MMDDYYYY');

    const SUMMIT_INDEX = 7;
    const NORTHWEST_INDEX = 6;
    const OUTBACK_INDEX = 5;

    let summit = getLift($, lifts, SUMMIT_INDEX);
    let northwest = getLift($, lifts, NORTHWEST_INDEX);
    let outback = getLift($, lifts, OUTBACK_INDEX);
    let data = {
      'summit' : summit,
      'northwest' : northwest,
      'outback' : outback
    };

    let statuses = [];
    statuses.push( getRedisVal(date, summit.status, 'summit') );
    statuses.push( getRedisVal(date, northwest.status, 'northwest') );
    statuses.push( getRedisVal(date, outback.status, 'outback') );
    promise.all(statuses).then( (vals) => {
      gnartify(date, vals, data, alerts);
    });
  });
}

function getRedisVal(date, status, name_lift){
  const KEY = `${name_lift}_${date}`;
  return new Promise( (resolve, reject) => {
    redisClient.get(KEY, (err, val) => {
      redisClient.set(KEY, status);
      if(err){ reject(err); }
      else{ resolve({name_lift:name_lift, status:val}); }
    });
  });
}

function getLift($, lifts, liftIndex){
  let lift = $(lifts).eq(liftIndex);
  return {
    status: $(lift).find('.statuses').eq(0).find('.status').eq(0).find('i').attr('class'),
    details: $(lift).find('.details').find('.title').find('small').html()
  };
}

function gnartify(date, previousData, newData, alerts){
  let updates = [];
  let inital = [];
  previousData.forEach( lift => {
    inital.push({name_lift: lift.name_lift, data:newData[lift.name_lift]});
    if( lift.status && lift.status !== newData[lift.name_lift].status){
      updates.push({name_lift: lift.name_lift, data:newData[lift.name_lift]});
    }
  });

  alerts.forEach( (alert, index) => {
    (function(alert) {
      setTimeout(function(){
        if( !alert.initial ){
          sendMessage(alert, inital);
          updateAlertInitialized(alert);
        }
        if( alert.initial && updates.length > 0 ){
          sendMessage(alert, updates);
        }
      }, 5000 * index);
    }(alert, index));
  });
}

function sendMessage(alert, gnartification){
  let message = 'New Gnartification\n\n';
  gnartification.forEach( gnar => {
    message += `${gnar.name_lift.charAt(0).toUpperCase()}${gnar.name_lift.slice(1)}\n`;
    message += `Status: ${STATUS_MAP[gnar.data.status]}\n`;
    message += `Details: ${gnar.data.details}\n\n`;
  });
  nexmo.message.sendSms(NEXMO_FROM, alert.number, message, (error, response) => {
    if(error) { console.log(error); }
  });
}

function updateAlertInitialized(alert){
    let alerts = new Alerts();
    let update = { "initial" : true };
    alerts.updateAlerts(alert, update)
        .then( msg => {
            // chill
        }, err => {
            console.log(err);
        });
}
