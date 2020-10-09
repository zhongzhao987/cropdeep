var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var posSchema = new Schema({
  longitude: String,
  latitude:  String,
  distance: String,
  sensor: String,
  start_time: String,
  end_time: String
});

// the schema is useless so far
// we need to create a model using it
var PosData = mongoose.model('PosData', posSchema);

// make this available to our users in our Node applications
module.exports = PosData;

