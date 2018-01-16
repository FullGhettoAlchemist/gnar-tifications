var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');

let Schema = mongoose.Schema
    ObjectID = mongoose.ObjectID;
let userSchema = new Schema({
  id:         ObjectID,
  name:       String,
  number:     {type: Number, required: true, unique: true },
  email:      String,
  date:       Date;
})

let User = mongoose.model('User', userSchema);

module.exports = User;
