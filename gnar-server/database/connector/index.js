// Import dependencies
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const MONGO_USER = fs.readFileSync('/run/secrets/mongo-user', 'utf-8').replace(/(\r\n|\n|\r)/gm,"");
const MONGO_PASSWORD = encodeURIComponent(fs.readFileSync('/run/secrets/mongo-password', 'utf-8').replace(/(\r\n|\n|\r)/gm,""));

class Connector {
	constructor(){
		this.uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@gnarcluster-shard-00-00-3cdig.mongodb.net:27017,gnarcluster-shard-00-01-3cdig.mongodb.net:27017,gnarcluster-shard-00-02-3cdig.mongodb.net:27017/test?ssl=true&replicaSet=GnarCluster-shard-0&authSource=admin`;
		this.database = 'test';
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
const ConnectionService = new Connector();
module.exports = { ConnectionService };