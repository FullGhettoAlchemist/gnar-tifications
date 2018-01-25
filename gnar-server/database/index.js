// Import dependencies
const fs = require('fs');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const MONGO_USER = fs.readFileSync('/run/secrets/mongo-user', 'utf-8').replace(/(\r\n|\n|\r)/gm,"");
const MONGO_PASSWORD = fs.readFileSync('/run/secrets/mongo-password', 'utf-8').replace(/(\r\n|\n|\r)/gm,"");

class Connector {
	constructor(){
		this.uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@gnarcluster-shard-00-00-3cdig.mongodb.net:27017,gnarcluster-shard-00-01-3cdig.mongodb.net:27017,gnarcluster-shard-00-02-3cdig.mongodb.net:27017/test?ssl=true&replicaSet=GnarCluster-shard-0&authSource=admin`;
	}

	connect(){
	    // Return new promise 
	    return new Promise( (resolve, reject) => {
	    	MongoClient.connect(this.uri, (err, db) => {
	    		if (err) {
	                reject(err);
	            } else {
	                resolve(db);
	            }
			});
	    })
	}
}

// create mongoose schema
let userSchema = new mongoose.Schema({
	name   : String,
	number : {type: Number, required: true, unique: true },
	email  : String
});

let alertSchema = new mongoose.Schema({
	number  : {type: Number, required: true, unique: true },
	alerted : Boolean
});

// create mongoose model
const User = mongoose.model('User', userSchema);
const Alert = mongoose.model('Alert', alertSchema);


module.exports = { Connector, User, Alert };