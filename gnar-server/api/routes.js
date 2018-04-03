// Import dependencies
const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();
// Import internal dependencies
const { ConnectionService, UsersService, AlertsService } = require('../database');
const { sms } = require('../sms');

/* GET api listing. */
// router.get('/', (req, res) => {
//     ConnectionService.connect()
//         .then( (db) => {
//             res.send('api works, database connected =D');
//         }, (err) => {
//             console.log(err);
//             res.send('api works, database failed to connect =(');
//         });  
// });

/* GET all users. */
router.get('/users', (req, res) => {
    let query = {};
    UsersService.getUsers(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* CREATE a user. */
router.post('/users', (req, res) => {
    let digits = sms.extractPhoneNumberDigits(req.body.number);
    if(!digits){
        console.log('the entered number was invalid');
        return;
    }
    let number = `${'1'}${digits}`;
    let name = req.body.name;
    let email = req.body.email;
    let msg = `Welcome to Gnartify!\nText 'gnar' to this number any day you're up at Bachelor to get instant lift status alerts for Summit, Outback, and Northwest.`;
    sms.send(number, msg);
    UsersService.createUsers(name, number, email)
        .then( packet => {
            res.send(`inserted user ${name}`);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* DELETE all users */
router.delete('/users', (req, res) => {
    let query = {};
    UsersService.deleteUsers(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* GET all alerts. */
router.get('/alerts', (req, res) => {
    let query = {};
    AlertsService.getAlerts(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});
/* GET todays alerts. */
router.get('/alerts/today', (req, res) => {
    let query = { date: moment().format('MMDDYYYY') };
    AlertsService.getAlerts(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* CREATE an alert. */
router.post('/alerts', (req, res) => {
    const NOW_LA_TIMEZONE = moment().tz("America/Los_Angeles").format('H');
    const number = req.body.msisdn;
    const msg = ( Number(NOW_LA_TIMEZONE) >= 16 ) ? `You're in!\nYou will receive your initial gnartification when the lifts open at 9:00` : `You're in!\nStandby for your initial gnartification`;
    sms.send(number, msg);
    // todo check to see if 'gnar' is anywhere in req.body.text
    AlertsService.createAlerts(number)
        .then( packet => {
            res.send(`inserted alert ${number}`);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});
/* DELETE alert for today */
router.delete('/alerts/today', (req, res) => {
    let query = { date: moment().format('MMDDYYYY') };
    AlertsService.deleteAlerts(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

module.exports = router;