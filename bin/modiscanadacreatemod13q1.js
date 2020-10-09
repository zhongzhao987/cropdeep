// set up ======================================================================

// node modiscanadacreatemod13q1.js D:\webs\node-todo\node-todo-master\data\raster\modis\mod13q1\canada\index.txt create


/*

index.txt contains Canada's image files MOD13Q1 ( NDVI now it is only for 2017 )
(h09v04,time, filename;)

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
var tblname = "canada_mod13q1";
console.log("table name:", tblname);

// create a schema for the collection
var schema = new mongoose.Schema({
	zone:String,
	otime:String,
	filename:String
});

// set index for the collection
schema.index({zone: 1 });

// create collection
var geoModel = mongoose.model(tblname, schema);

if( createOP === "create" ){
    var arrays, length;
    
    // get readline objecct
    var lineReader = require('readline').createInterface({
	    input: require('fs').createReadStream(filename)
	});

    // read line one by one
    lineReader.on('line', function (line) {
	    // token the line to string array - zone and verices (x, y)
	    arrays = line.trim().split(" ");
		
	    if( arrays.length == 3 ){
	    
		console.log("Zone: ", arrays[0]);
		console.log("Time: ", arrays[1]);
		console.log("Filename: ", arrays[2]);

		// create an instance - document
		var doc = new geoModel({
		    zone:arrays[0],
		    otime:arrays[1],
		    filename:arrays[2]
		});
	    }

	    // save to the collection
	    doc.save(function(err) {
		    if(err) 
			console.error(err);
		})
		})
	lineReader.on('close', function() {
		console.log('file reading ends!');
	    });
	
	console.log('Finished');
}

//mongoose.disconnect();

console.log('total records', geoModel.count());
