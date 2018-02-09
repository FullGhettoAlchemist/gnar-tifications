const { Connector } = require('../connector');
const { AlertModel } = require('./alert.model');

class Alerts {
	constructor(){
		this.collection = 'alerts';
	}

	getAlerts(query){
		return new Promise( (resolve, reject) => {
			let connection = new Connector();
		    connection.connect()
		        .then( db => {
		            const collection = db.db(connection.database).collection(this.collection);
		            collection.find(query).toArray( (err, items) => {
		            	err ? reject(err) : resolve(items);
		                db.close();
		            });
		        }, err => {
		            reject(err);
		        });
	    });
	}

	createAlerts(number){
		let alert = new AlertModel(number);
		return new Promise( (resolve, reject) => {
			if(!number){ reject('ERROR! No Number Provided. Alert not inserted'); }
			let connection = new Connector();
		    connection.connect()
		        .then( db => {
		            const collection = db.db(connection.database).collection(this.collection);
		            collection.insertOne(alert, (err, items) => {
		            	err ? reject(err) : resolve(items);
		                db.close();
		            });
		        }, err => {
		            reject(err);
		        });
	    });
	}

	updateAlerts(alert, update){
		return new Promise( (resolve, reject) => {
			let connection = new Connector();
		    connection.connect()
		        .then( db => {
		            const collection = db.db(connection.database).collection(this.collection);
		            collection.updateOne(alert, { $set: update }, (err, msg) => {
		            	err ? reject(err) : resolve(msg);
		                db.close();
		            });
		        }, err => {
		            reject(err);
		        });
	    });
	}

	deleteAlerts(query){
		return new Promise( (resolve, reject) => {
			let connection = new Connector();
		    connection.connect()
		        .then( db => {
		            const collection = db.db(connection.database).collection(this.collection);
		            collection.remove(query, (err, msg) => {
		            	err ? reject(err) : resolve(msg);
		                db.close();
		            });
		        }, err => {
		            reject(err);
		        });
	    });
	}
}

module.exports = { Alerts };