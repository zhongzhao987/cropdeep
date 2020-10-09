var mongoose = require('mongoose');

module.exports = mongoose.model('modis_canada_footprint', {
	geometry : {
	    type: {type: String},
	    coordinates : []
	},
	zone : String
});
