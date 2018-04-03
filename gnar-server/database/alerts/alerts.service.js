const { ConnectionService } = require('../connector');
const { AlertModel } = require('./alert.model');

class Alerts {
	constructor(){
		this.collection = 'alerts';
	}

	getAlerts(query){
		return new Promise( (resolve, reject) => {
			const collection = ConnectionService.db.db(ConnectionService.database).collection(this.collection);
            collection.find(query).toArray( (err, items) => {
            	err ? reject(err) : resolve(items);
            });
	    });
	}

	createAlerts(number){
		let alert = new AlertModel(number);
		return new Promise( (resolve, reject) => {
			if(!number){ reject('ERROR! No Number Provided. Alert not inserted'); }
			const collection = ConnectionService.db.db(ConnectionService.database).collection(this.collection);
            collection.insertOne(alert, (err, items) => {
            	err ? reject(err) : resolve(items);
            });
	    });
	}

	updateAlerts(alert, update){
		return new Promise( (resolve, reject) => {
			const collection = ConnectionService.db.db(ConnectionService.database).collection(this.collection);
            collection.updateOne(alert, { $set: update }, (err, msg) => {
            	err ? reject(err) : resolve(msg);
            });
	    });
	}

	deleteAlerts(query){
		return new Promise( (resolve, reject) => {
			const collection = ConnectionService.db.db(ConnectionService.database).collection(this.collection);
            collection.remove(query, (err, msg) => {
            	err ? reject(err) : resolve(msg);
            });
	    });
	}
}
const AlertsService = new Alerts();
module.exports = { AlertsService };