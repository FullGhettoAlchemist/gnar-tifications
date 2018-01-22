// Import dependencies
const mongoose = require('mongoose');

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/gnar-tifications';

// Connect to mongodb
mongoose.connect(dbHost);

// create mongoose schema
let userSchema = new mongoose.Schema({
  name:       String,
  number:     {type: Number, required: true, unique: true },
  email:      String,
  date:       Date
})

// create mongoose model
const User = mongoose.model('User', userSchema);


module.exports = { User };