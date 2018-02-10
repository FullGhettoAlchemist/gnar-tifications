const fs = require('fs');
const Nexmo = require('nexmo');

const NEXMO_API_KEY = fs.readFileSync('/run/secrets/nexmo-key', 'utf-8');
const NEXMO_API_SECRET = fs.readFileSync('/run/secrets/nexmo-secret', 'utf-8');
const NEXMO_OPTIONS = { debug: false };

const nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET
}, NEXMO_OPTIONS);

class SMS {
	constructor(){
		this.gnar_number = '15412490080';
	}

	send(to_number, msg){
		console.log(`Sending message to ${to_number}`);
		nexmo.message.sendSms(this.gnar_number, to_number, msg, (error, response) => {
			if(error) { console.log(error); }
		});
	}
}

module.exports = { SMS };