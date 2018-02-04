// Import dependencies
const fs = require('fs');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;

// const MONGO_USER = fs.readFileSync('/run/secrets/mongo-user', 'utf-8').replace(/(\r\n|\n|\r)/gm,"");
// const MONGO_PASSWORD = fs.readFileSync('/run/secrets/mongo-password', 'utf-8').replace(/(\r\n|\n|\r)/gm,"");
const MONGO_USER = 'locdawg';
const MONGO_PASSWORD = encodeURIComponent('gi14QeS9i7IW$0f');

class Connector {
	constructor(){
		this.uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@gnarcluster-shard-00-00-3cdig.mongodb.net:27017,gnarcluster-shard-00-01-3cdig.mongodb.net:27017,gnarcluster-shard-00-02-3cdig.mongodb.net:27017/test?ssl=true&replicaSet=GnarCluster-shard-0&authSource=admin`;
		this.database = 'test';
		// this.database = 'production';
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

class User {
	constructor(name,number,email){
		this.name = name;
		this._id = number;
		this.email = email;
	}
}

class Alert {
	constructor(number){
		this.number = number;
		this.date = moment().format('MMDDYYYY');
		this._id = `${this.number}_${this.date}`;
	}
}

module.exports = { Connector, User, Alert };