// Import dependencies
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
// Import internal dependencies
const routes = require('./routes');
const { ConnectionService } = require('../database');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set our api routes
app.use('/', routes);

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

ConnectionService.connect()
    .then( (db) => {
    	// create the server
		const server = http.createServer(app);
		server.listen(port, () => console.log(`getting gnarly on port:${port}`));
    }, (err) => {
        console.log(err);
        console.log('Gnarly failure, database connection error');
    });  


