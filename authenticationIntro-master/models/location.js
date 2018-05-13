
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var locationSchema = mongoose.Schema({
  name: String,
  longitude: String,
  latitude: String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('location', locationSchema);
