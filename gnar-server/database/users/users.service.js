const { ConnectionService } = require('../connector');
const { UserModel } = require('./user.model');

class Users {
	constructor(){
		this.collection = 'users';
	}

	/*
	* query is an object of keys to match on
	*/
	getUsers(query){
		return new Promise( (resolve, reject) => {
		    ConnectionService.connect()
		        .then( db => {
		            const collection = db.db(ConnectionService.database).collection(this.collection);
		            collection.find(query).toArray( (err, items) => {
		            	err ? reject(err) : resolve(items);
		                db.close();
		            });
		        }, err => {
		            reject(err);
		        });
	    });
	}

	createUsers(name,number,email){
		let user = new UserModel(name,number,email);
		return new Promise( (resolve, reject) => {
		    ConnectionService.connect()
		        .then( db => {
		            const collection = db.db(ConnectionService.database).collection(this.collection);
		            collection.insertOne(user, (err, msg) => {
		            	err ? reject(err) : resolve(msg);
		                db.close();
		            });
		        }, err => {
		            reject(err);
		        });
	    });
	}

	updateUsers(){

	}

	deleteUsers(query){
		return new Promise( (resolve, reject) => {
		    ConnectionService.connect()
		        .then( db => {
		            const collection = db.db(ConnectionService.database).collection(this.collection);
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
const UsersService = new Users();
module.exports = { UsersService };