const forever = require('forever-monitor');
 
let gnar = new (forever.Monitor)('./index.js', {
	max: 3,
	silent: false,
	args: []
});

gnar.on('exit', function () {
	console.log('gnartify has exited after 3 restarts');
});

gnar.start();