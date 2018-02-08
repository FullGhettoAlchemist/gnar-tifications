class UserModel {
	constructor(name,number,email){
		this.name = name;
		this._id = number;
		this.email = email;
	}
}

module.exports = { UserModel };