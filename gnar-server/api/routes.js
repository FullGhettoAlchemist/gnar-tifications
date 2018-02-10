// Import dependencies
const moment = require('moment');
const express = require('express');
const router = express.Router();
// Import internal dependencies
const { Connector, Users, Alerts } = require('../database');
const { SMS } = require('../sms');

/* GET api listing. */
router.get('/', (req, res) => {
    let connection = new Connector();
    connection.connect()
        .then( (db) => {
            res.send('api works, database connected =D');
        }, (err) => {
            console.log(err);
            res.send('api works, database failed to connect =(');
        });  
});

/* GET all users. */
router.get('/users', (req, res) => {
    let users = new Users();
    let query = {};
    users.getUsers(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* CREATE a user. */
router.post('/users', (req, res) => {
    let number = `${'1'}${req.body.number}`;
    let name = req.body.name;
    let email = req.body.email;
    let msg = `
        Welcome to Gnartify!\n\n
        Text 'gnar' to this number any day you're up at Bachelor to get instant lift status alerts for Summit, Outback, and Northwest.
    `;
    let users = new Users();
    users.createUsers(name, number, email)
        .then( packet => {
            res.send(`inserted user ${name}`);
            console.log(packet);
            console.log(number);
            console.log(msg);
            SMS.send(number, msg);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* DELETE all users */
router.delete('/users', (req, res) => {
    let query = {};
    let users = new Users();
    users.deleteUsers(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* GET all alerts. */
router.get('/alerts', (req, res) => {
    let alerts = new Alerts();
    let query = {};
    alerts.getAlerts(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});
/* GET todays alerts. */
router.get('/alerts/today', (req, res) => {
    let alerts = new Alerts();
    let query = { date: moment().format('MMDDYYYY') };
    alerts.getAlerts(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

/* CREEATE an alert. */
router.post('/alerts', (req, res) => {
    // todo check to see if 'gnar' is anywhere in req.body.text
    let number = req.body.msisdn;
    let alerts = new Alerts();
    alerts.createAlerts(number)
        .then( packet => {
            res.send(`inserted alert ${number}`);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});
/* DELETE alert for today */
router.delete('/alerts/today', (req, res) => {
    let query = { date: moment().format('MMDDYYYY') };
    let alerts = new Alerts();
    alerts.deleteAlerts(query)
        .then( packet => {
            res.send(packet);
        }, err => {
            res.send({ message : 'Failure', error : err });
        });
});

module.exports = router;