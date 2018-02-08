const moment = require('moment');

class AlertModel {
	constructor(number){
		this.number = number;
		this.date = moment().format('MMDDYYYY');
		this.initial = false;
		this._id = `${this.number}_${this.date}`;
	}
}

module.exports = { AlertModel };