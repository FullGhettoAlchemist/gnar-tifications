// Import dependencies
const moment = require('moment');
const express = require('express');
const router = express.Router();
// Import internal dependencies
const { Connector, User, Alert } = require('../database');

/* GET api listing. */
router.get('/', (req, res) => {
    let connection = new Connector();
    connection.connect()
        .then( (db) => {
            res.send('api works, database connected =D');
        }, (err) => {
            res.send('api works, database failed to connect =(');
        });  
});

/* GET all users. */
router.get('/users', (req, res) => {
    let connection = new Connector();
    connection.connect()
        .then( (db) => {
            let dbo = db.db(connection.database);
            const collection = dbo.collection('users');
            collection.find({}).toArray( (err, items) => {
                res.send(items);
                db.close();
            });
            
        }, (err) => {
            res.send({
                message : 'Failure',
                error   : err
            });
        });
});


/* Create a user. */
router.post('/users', (req, res) => {
	let number = req.body.number;
    let name = req.body.name;
    let email = req.body.email;
    let connection = new Connector();
    connection.connect()
        .then( (db) => {
            let dbo = db.db(connection.database);
            let user = new User(name,number,email);
            dbo.collection("users").insertOne(user, (err, msg) => {
                if (err){
                    res.send(err);
                }else{
                    res.send(msg);
                }
                db.close();
            });
        }, (err) => {
            res.send({
                message : 'Failure',
                error   : err
            });
        });
});

/* GET all alerts. */
router.get('/alerts', (req, res) => {
    let connection = new Connector();
    connection.connect()
        .then( (db) => {
            let dbo = db.db(connection.database);
            const collection = dbo.collection('alerts');
            collection.find({}).toArray( (err, items) => {
                res.send(items);
                db.close();
            });
            
        }, (err) => {
            res.send({
                message : 'Failure',
                error   : err
            });
        });
});

router.get('/alerts/today', (req, res) => {
    let connection = new Connector();
    connection.connect()
        .then( (db) => {
            let dbo = db.db(connection.database);
            const collection = dbo.collection('alerts');
            collection.find({ date: moment().format('MMDDYYYY') }).toArray( (err, items) => {
                res.send(items);
                db.close();
            });
        }, (err) => {
            res.send({
                message : 'Failure',
                error   : err
            });
        });
});


// UPDATE EXAMPLE

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   var myquery = { address: "Valley 345" };
//   var newvalues = { name: "Mickey", address: "Canyon 123" };
//   dbo.collection("alerts").updateOne(alert, {alerted:true}}, (err, res) => {
//     if (err) throw err;
//     console.log("1 document updated");
//     db.close();
//   });
// });

/* Create an alert. */
router.post('/alerts', (req, res) => {
    let number = req.body.number;
    let connection = new Connector();
    connection.connect()
        .then( (db) => {
            let dbo = db.db(connection.database);
            let alert = new Alert(number);
            dbo.collection("alerts").insertOne(alert, (err, msg) => {
                if (err){
                    res.send(err);
                }else{
                    res.send(msg);
                }
                db.close();
            });
        }, (err) => {
            res.send({
                message : 'Failure',
                error   : err
            });
        });
});

module.exports = router;