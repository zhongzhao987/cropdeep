var url   = require('url');

// Get the collection in the database
var L8Collection = require('./models/l8collection');
var ModisCanadaFootprint = require('./models/modis_canada_footprint');
var CanadaMod11A2 = require('./models/canada_mod11a2');
var CanadaMod09Q1 = require('./models/canada_mod09q1');
var CanadaMod13Q1 = require('./models/canada_mod13q1');

var http = require('http');
var queryString = require('querystring');
var async = require('async');

var utils = require('./utils');







	     
/*
 multiple queries:
 1. build temp input and output file for GDAL exe commands
 2. run GDAL commands
 3. get json object from each GDAL run
 4. organize them and send back to client
*/

function getDataFromFiles(dataFiles, lng, lat, distance, beginning, timeInterval,res){
    
    console.log("\nIn GETDATAFROMFILLE\n");

    // create temp files for input and output for GDAL exec
    var fs = require('fs');
    var temp = require('temp');

    var l8Name, l8Outname, tempeName, tempeOutname;
    var ndviName, ndviOutname, reflectName, reflectOutname;

    // loop each query type
    var dataJson = {};
    dataJson.L8Image = null;
   
    var bFound = false;
  
    if( bFound == false )
	dataJson.error = "Cannot find data";
    else
	dataJson.error = "None";
   
    res.json(dataJson);
};
   


	

var buildExeCommand = function( list, lng, lat, distance,
				tempName, outName, type,
				 beginning, timeInterval){
   
    var filenames = [];

    console.log(" in buildExeCommand.");
  			    
  
    
    // found the output file
    console.log("Files to write: " + strline);
				    
  
   
    return exename;
};

var AddDataToJson = function(dataJson, outFiles, data, type, imgList){

  for( var i = 0; i < outFiles.length; i+=2){
      // get input file name
      var rgbname = outFiles[i];
      var outname = outFiles[i+1];
	
      var val1, val2, timeseg = "", bFound = false;
      if( data.length == 1 ){
	  val1 = data[i];
      }
      else if( data.length == 2 ){
	  val1 = data[i];
	  val2 = data[i+1];
      }
      // find the time stamp for this image
      for( var j = 0; j < imgList.length; j++ ){
	  var obj = Object(imgList[j]);							
	  if( rgbname == obj.imagename ){
	      bFound = true;
	      timeseg = obj.timeseg;
	      break;
	  }
      }
      if( bFound == true ){
	  // add data and time to json
	  var bitmap = fs.readFileSync(outname);
	  var buf = new Buffer(bitmap).toString('base64');
	  if( type == "temperature" ){
	      var img = {
		  time: timeseg,
		  rgbfile:rgbname,
		  imgdata:buf,
		  ht:val1,
		  lt:val2
	      }
	  }
	  else if( type == "ndvi" && data.length == 1 ){
	      var img = {
		  time: timeseg,
		  rgbfile:rgbname,
		  imgdata:buf,
		  ndvi:val1,
	      }
	  }
	  else {
	      var img = {
		  time: timeseg,
		  rgbfile:rgbname,
		  imgdata:buf
	      }
	  }
	  dataJson.data.push(img);
      }
  }
};

var runGetDataCommand = function(exename, outname, imgList, type){
    	
    var itemList = [];

    // run exec
    var cp = require('child_process');  
    cp.execSync(exename);
    console.log("executable finished");

    var outFiles = [];
    var fs = require('fs');
    var stats = fs.existsSync(outname);
		
    console.log("Output file status: ", stats);

    if( stats != true ){
	var err = "Cannot found output data file.";
	return itemList;
    }
    else{
				
	console.log("Read output file: ");
	var outFiles = [];

	var lines = fs.readFileSync(outname, 'utf-8')
	.split('\n')
	.filter(Boolean);

	var data2 = [];
	var eviFiles = [];

	if( type != "ndvi" ){
	    for( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
	 
		var arrays = line.trim().split(";");
		console.log("Line seg length: " + arrays.length);
	    
	    
		if( arrays.length < 2 ||  arrays[1] == "NONE" )
		    continue;
	    
		outFiles.push(arrays[0]);   // arrays[0] - original file
		outFiles.push(arrays[1]);   // arrays[1] - out bmp file name

		if( type == "temperature" ){
		    data2.push(arrays[2]);
		    data2.push(arrays[3]);
		}
	    }
	}
	else{
	    // it has two lines structures:
	    // ndvi line + ndvi value
	    // evi line
	    for( var i = 0; i < lines.length; i+=2 ){
		var line = lines[i];
		var arrays = line.trim().split(";");
		console.log("Line seg length: " + arrays.length);
		var line2 = lines[i+1];
		var arrays2 = line.trim().split(";");
		console.log("Line seg length: " + arrays.length);
		if( arrays.length < 4 ||  arrays2.length < 2 )
		    continue;

		outFiles.push(arrays[0]);   // arrays[0] - original file
		outFiles.push(arrays[1]);   // arrays[1] - out bmp file name
		data2.push(arrays[2]);      // ndvi data
	   	
		// get evi files
		eviFiles.push(arrays2[0]);   // arrays[0] - original file
		eviFiles.push(arrays2[1]);   // arrays[1] - out bmp file name
	    }
	}

	console.log("Outfiles length: " + outFiles.length);
							
	// build the json object
	if( outFiles.length > 0 ){
	    var dataJson = {};
	    dataJson.width = 128;
	    dataJson.height = 128;
	    dataJson.imgtype = "bmp";
	    dataJson.operatetype = type;
	    dataJson.error = "None";
	    dataJson.data = [];
	    
	    AddDataToJson(dataJson, outFiles, data2, type, imgList);
	    
	    if( type == "ndvi" ){
		AddDataToJson(dataJson, eviFiles, [], type, imgList);
	 		
	    // send back 
	    console.log("json length: " + dataJson.data.length);
	    if( dataJson.data.length > 0 )
		itemList.push(dataJson);
	    return itemList;
	    
	}
	else
	    return itemList;					
    }		 
};

var buildObjLocationList = function(results, dis) {
    var locations = [];
    results.forEach(function(doc) {
        locations.push({
            distance: dis, 
            filename: doc.obj.filename,
            date: doc.obj.date,
            cloud: doc.obj.cloud,
            _id: doc.obj._id
        });
    });
    return locations;
};

// Entry point for scene selection
var runCanEnv = {};
module.exports = function SelectFiles(app, req, res) { 

    console.log("In Path: " + req.path);

    if( req.path == "/api/maploc") {
	console.log("In GET");

  



	// get query params as object
	if (req.url.indexOf('?') >= 0) {
	    oQueryParams = queryString.parse(req.url.replace(/^.*\?/, ''));

	    var params = require('util').inspect(oQueryParams);
	    obj = eval("(function(){return " + params + ";})()");
	 

	 
	   
	    
	}



	//res.json([{"name":"Hello Yun!"}]);

    }
    else
	res.json([{"name":"Hello Yun!"}]);
    
};
    
