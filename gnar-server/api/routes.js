// Import dependencies
const moment = require('moment');
const express = require('express');
const router = express.Router();
// Import internal dependencies
const { Connector, Users, Alerts } = require('../database');

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
    let number = req.body.number;
    let name = req.body.name;
    let email = req.body.email;
    let users = new Users();
    users.createUsers(number, name, email)
        .then( packet => {
            res.send(`inserted user ${name}`);
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

/* Create an alert. */
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

module.exports = router;