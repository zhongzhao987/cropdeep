var mongoose = require('mongoose');

module.exports = mongoose.model('l8collection', {
	geometry : {
	    type: {type: String},
	    coordinates : []
	},
	filename : String,
	date : Date,
	cloud : Number
});

