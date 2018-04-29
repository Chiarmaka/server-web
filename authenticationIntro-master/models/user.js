
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var chatSchema = mongoose.Schema({
  user: String,
  message: String,
  location: String,
  created: {type: Date, default: Date.now}

});

var userSchema = mongoose.Schema({ 

  name      : String,
  email     : String, 
  hashed_password : String,
  created_at    : String,
  temp_password : String,
  temp_password_time: String
});
mongoose.Promise = global.Promise;

module.exports = mongoose.model('chat', chatSchema);
module.exports = mongoose.model('user', userSchema);  