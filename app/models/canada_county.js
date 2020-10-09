var mongoose = require('mongoose');

module.exports = mongoose.model('canada_county', {
	geometry : {
	    type: {type: String},
	    coordinates : []
	},
	CUID : String,
	province : String,
	county : String
});
