const fs = require('fs');
const Nexmo = require('nexmo');

const NEXMO_API_KEY = fs.readFileSync('/run/secrets/nexmo-key', 'utf-8');
const NEXMO_API_SECRET = fs.readFileSync('/run/secrets/nexmo-secret', 'utf-8');
const NEXMO_OPTIONS = { debug: true };

class SMS {
	constructor(){
		this.gnar_number = '15412490080';
		this.nexmo = new Nexmo({
			apiKey: NEXMO_API_KEY,
			apiSecret: NEXMO_API_SECRET
		}, NEXMO_OPTIONS);
	}

	send(to_number, msg){
		console.log('sending message');
		this.nexmo.message.sendSms(this.gnar_number, to_number, msg, (error, response) => {
			if(error) { console.log(error); }
		});
	}
}
const sms = new SMS();
module.exports = { sms };