
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({ 

  name      : String,
  email     : String, 
  hashed_password : String,
  created_at    : String,
  temp_password : String,
  temp_password_time: String
});
mongoose.Promise = global.Promise;


module.exports = mongoose.model('user', userSchema);  