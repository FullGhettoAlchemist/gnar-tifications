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
			const collection = ConnectionService.db.db(ConnectionService.database).collection(this.collection);
            collection.find(query).toArray( (err, items) => {
            	err ? reject(err) : resolve(items);
            });
	    });
	}

	createUsers(name,number,email){
		let user = new UserModel(name,number,email);
		return new Promise( (resolve, reject) => {
			const collection = ConnectionService.db.db(ConnectionService.database).collection(this.collection);
            collection.insertOne(user, (err, msg) => {
            	err ? reject(err) : resolve(msg);
            });
	    });
	}

	deleteUsers(query){
		return new Promise( (resolve, reject) => {
			const collection = ConnectionService.db.db(ConnectionService.database).collection(this.collection);
            collection.remove(query, (err, msg) => {
            	err ? reject(err) : resolve(msg);
            });
	    });
	}
}
const UsersService = new Users();
module.exports = { UsersService };