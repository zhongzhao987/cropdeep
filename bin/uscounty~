// set up ======================================================================

// node canadacounty.js D:\images\vectors\canada\gcd_000a11a_e\canada_county.txt create


/*

gcd_canada_agri.txt contains Canada's county/division boundaries

- create a schema for collection
- read file and split each line to an array
- use meaningful attributes to create an instance 
- save to collection

- it is an async process, need time to close file (sync?)

*/


var filename = process.argv[2]; //value will be "filename"
var createOP = process.argv[3]; //value will be "create or update"
				
var mongoose = require('mongoose'); 				// mongoose for mongodb
mongoose.Promise = global.Promise;
var port = process.env.PORT || 8080; 				// set the port
var database = require('../config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
// Connect to local MongoDB instance. 
mongoose.connect(database.localUrl); 	//A remoteUrl is also available (modulus.io)

// open database
mongoose.connection.on('error', function () {
  console.error('connection error', arguments);
});

mongoose.connection.once('open', function (){
    console.log("Mongoose connection opened on process " + process.pid);
});


// set collection name
var tblname = "canada_county";
console.log("table name:", tblname);

// create a schema for the collection
var schema = new mongoose.Schema({
	geometry : {
	    type: {type: String},
	    coordinates : []
	},
    CUID:String,
    province : String,
    county:String
});

// set index for the collection
schema.index({geometry: '2dsphere'});

// create collection
var geoModel = mongoose.model(tblname, schema);

if( createOP === "create" )
{
    var arrays, length;
    
    // get readline objecct
    var lineReader = require('readline').createInterface({
	    input: require('fs').createReadStream(filename)
	});

    // read line one by one
    var step = 0;
    var oProvince, oCounty, oID;
    lineReader.on('line', function (line){
	// token the line to string array - zone and verices (x, y)
	arrays = line.trim().split(":");
	if( step == 0 )
	{
	    oID = arrays[0];
	    oProvince = arrays[1];
	    oCounty = arrays[2]
	    step++;
	}
	else
	{
	    var cline = [];
	    length = arrays.length;
	    console.log("vertex length: ", length);
	    for( var i = 0; i < length; i += 2 )
	    {
		var vertex = [ Number(arrays[i]), Number(arrays[i+1]) ];
		cline.push(vertex);
	    }
	    var poly = [];
	    poly.push( cline );

	    console.log("Params:");
	    console.log("ID: " + oID);
	    console.log("Prov: " + oProvince);
	    console.log("County: " + oCounty);
	       
	    // create an instance - document
	    var doc = new geoModel({
		    geometry : {
			type : 'Polygon',
			        coordinates : poly
		    },
		CUID:oID,
		province:oProvince,
		county : oCounty
		});

	    // save to the collection
	    doc.save(function(err) {
		    if(err) 
			console.error(err);
	    })
	    step = 0;
	}
    })
    lineReader.on('close', function() {
		console.log('file reading ends!');
	    });
}

//mongoose.disconnect();

console.log('total records', geoModel.count());
