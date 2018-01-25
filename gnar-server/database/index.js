// Import dependencies
const fs = require('fs');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const MONGO_USER = fs.readFileSync('/run/secrets/mongo-user', 'utf-8').replace(/(\r\n|\n|\r)/gm,"");
const MONGO_PASSWORD = fs.readFileSync('/run/secrets/mongo-password', 'utf-8').replace(/(\r\n|\n|\r)/gm,"");

// MongoDB URL from the docker-compose file
const dbHost = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@gnarcluster-shard-00-00-3cdig.mongodb.net:27017,gnarcluster-shard-00-01-3cdig.mongodb.net:27017,gnarcluster-shard-00-02-3cdig.mongodb.net:27017/test?ssl=true&replicaSet=GnarCluster-shard-0&authSource=admin`;
// Connect to mongodb
MongoClient.connect(dbHost, (err, db) => {
	console.log('we in');
	console.log(err);
	db.close();
});

// create mongoose schema
let userSchema = new mongoose.Schema({
	name:       String,
	number:     {type: Number, required: true, unique: true },
	email:      String
});

let alertSchema = new mongoose.Schema({
	number:     {type: Number, required: true, unique: true }
	alerted: Boolean
});

// create mongoose model
const User = mongoose.model('User', userSchema);
const Alert = mongoose.model('Alert', alertSchema);


module.exports = { User, Alert };