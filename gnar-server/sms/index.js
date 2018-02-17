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
		this.nexmo.message.sendSms(this.gnar_number, to_number, msg, (error, response) => {
			if(error) { console.log(error); }
		});
	}

	// Given a string, extract the ten digits of the phone number.
	// Returns an empty string if the text does not contain ten digits.
	// Examples:
	// extractPhoneNumberDigits("(555)-123-1234") -> 5551231234
	// extractPhoneNumberDigits("1 (555)-123-1234") -> 5551231234
	//
	// @param text | string - a string containing a phone number
	// @return | string - ten digits of the phone number
	extractPhoneNumberDigits(text) {
		let numbers = text.match(/\d/g);
		return numbers.length < 10 ? undefined : numbers.slice(-10).join([]);
	}
}
const sms = new SMS();
module.exports = { sms };