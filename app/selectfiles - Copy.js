var url   = require('url');

// Get the collection in the database
var L8Collection = require('./models/l8collection');

var http = require('http');
var queryString = require('querystring');

var utils = require('./utils');

var buildLocationList = function(results, dis, coordArray) {
    var arr = [];
    var uniqtimes = [];
    results.forEach(function(doc) {
	    console.log("filename: " + doc.filename);
	    console.log("cloud: " + doc.cloud);
	    console.log("date: " + doc.date);
	    console.log("geometry: ");
	    
	    // only handle t1 type now
	    if( doc.filename.indexOf("_T1") !== -1){
	    
		var geom = doc.geometry; 
		var coords = geom.coordinates;
		console.log("coordinates length: " + coords.length);
		var coordinates = coords[0];

		/*
		console.log("vertex 1 x: " + coordinates[0][0] );
		console.log("vertex 1 y: " + coordinates[0][1] );
		console.log("vertex 2 x: " + coordinates[1][0] );
		console.log("vertex 2 y: " + coordinates[1][1] );
		console.log("vertex 3 x: " + coordinates[2][0] );
		console.log("vertex 3 y: " + coordinates[2][1] );
		console.log("vertex 4 x: " + coordinates[3][0] );
		console.log("vertex 4 y: " + coordinates[3][1] );
		console.log("vertex 5 x: " + coordinates[4][0] );
		console.log("vertex 5 y: " + coordinates[4][1] );
		*/

		var array = [];
		array.push(coordinates[0].slice());
		array.push(coordinates[1].slice());
		array.push(coordinates[2].slice());
		array.push(coordinates[3].slice());
		array.push(coordinates[4].slice());
		coordArray.push(array.slice());

		var imagefile   = process.env.RASTER_DATA_DIR;
		//var imagefile = "C:\webs\node-todo\node-todo-master\data";
		console.log("raster dir: " + imagefile);

		var filename = doc.filename;
		var instr = filename.split("/");
		var len = instr.length;
		if( len == 1 )
		    instr = filename.split("\\");
	    
		console.log("file token size: " + len);
		console.log(instr);
		
		var bExt = false;
		var timeseg = "";
		if( len > 1 ){
		    var basename = instr[len-2];
		    console.log("basename: " + basename);
		    
		    // find time in the base name, only get one image for one time 
		    // because files may come from different path and rows and 
		    // duplicated
		    var namesegs = basename.split("_");
		    timeseg = namesegs[3];
		    console.log("File Timing: " + timeseg);
		    if( uniqtimes.indexOf(timeseg) < 0 ){
			uniqtimes.push(timeseg);
		    
			var imgname = basename + "_rgb.tif";
			console.log( "imagefile: " + imgname);

			imagefile = imagefile.concat( "/l8/collection/rgb/");
			imagefile = imagefile.concat( imgname);
		
			console.log("inputFile: " + filename);
			console.log("imageFile: " + imagefile);
		
			var fs = require('fs');
			bExt = fs.existsSync(imagefile);
			if( bExt == true)
			    console.log("File existing");
			else
			    console.log("File not existing");
			console.log("File existing: " + bExt);
		    }
		}

		if( bExt == true ){

		    arr.push({
			    "distance": String(dis), 
				"filename": String(doc.filename),
				"imagename": String(imagefile),
				"cloud": String(doc.cloud),
				"timeseg": String(timeseg),
				"date": String(doc.date),
				"_id": String(doc._id)
		    
			});
		}
	    }
    });

    // need to reoder file name base on the time
    var loc = [];
    var count = 0;
    console.log("data len: " + arr.length);
    console.log("array: " + arr);
    
    var index1 = 0;
    while( arr.length > 0 ){
	if( arr.length == 1 ){
	    var obj0 = Object(arr[0]);
	    loc.push({
		    "distance": String(obj0.distance), 
			"filename": String(obj0.filename),
			"imagename": String(obj0.imagename),
			"cloud": String(obj0.cloud),
		        "timeseg": String(obj0.timeseg),
			"date": String(obj0.date),
			"_id": String(obj0._id)
		    
			});
	    arr.splice(0,1);

	    console.log("Loc pushed: " + count);
	    console.log("pushed time: " + String(obj0.timeseg));
	    
	}
	else {	
	    var index = -1;
	    var i,timeseg1;
	    var obj = Object(arr[0]);
	    timeseg1 =  String(obj.timeseg);
	    index = 0;
	    for( i = 1; i < arr.length; i++) {
		var obj1 = Object(arr[i]);
		if( obj1.timeseg  <  timeseg1 ){
		    timeseg1 = obj1.timeseg;
		    index  = i;
		}
	    }
	    var obj2 = Object(arr[index]);
	    
	    console.log("index1: " + index1);
	    console.log("filename: " + String(obj2.imagename));
	    index1++;

	    loc.push({
		    "distance": String(obj2.distance), 
			"filename": String(obj2.filename),
			"imagename": String(obj2.imagename),
			"cloud": String(obj2.cloud),
		        "timeseg": String(obj2.timeseg),
			"date": String(obj2.date),
			"_id": String(obj2._id)

			});
	    arr.splice(index,1);

	    console.log("Loc pushed: " + count);
	    console.log("pushed time: " + String(obj2.timeseg));
	}
	count++;
	console.log("loop count: " + count);
	console.log("data len: " + arr.length);
	console.log("Array left: " + arr);

    }

    console.log("Filse found: " + loc.length);
    
    for( i = 0; i < loc.length; i++) {
	var obj = Object(loc[i]);
	console.log("Time seq: " + obj.timeseg);
	console.log("Image file: " + obj.imagename);
    }
	       
    return loc;
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


// Entry point for sence selection
module.exports = function SelectFiles(app, req, res) { 

    console.log("In Path: " + req.path);

    if( req.path == "/api/maploc") {
	console.log("In GET");

	//console.log(L8Collection.count());
  
	var distance=-1.0, lng, lat, sensor, cloud, sttime,endtime;
	var fileobj = [];
	var obj;

	// get query params as object
	if (req.url.indexOf('?') >= 0) {
	    oQueryParams = queryString.parse(req.url.replace(/^.*\?/, ''));

	    var params = require('util').inspect(oQueryParams);
	    obj = eval("(function(){return " + params + ";})()");
	    console.log(obj.sensor);
	    console.log(obj.longitude);
	    console.log(obj.latitude);
	    console.log(obj.starttime);
	    console.log(obj.endtime);
	    console.log(obj.cloud);
	    console.log(obj.distance);
	    console.log(obj.queryType);
	    console.log(obj.polygon);

	    distance = Number(obj.distance);
	    lng = Number(obj.longitude);
	    lat = Number(obj.latitude);
	    sensor = obj.sensor;
	    cloud = obj.cloud;
	    sttime = obj.starttime;
	    endtime = obj.endtime;
	    
	    queryType = obj.queryType;
	    poly = obj.polygon;
	}

	if( queryType == "near" ){
	
	    if( distance > 0 ){
	    
		console.log("In DB");
		console.log("distance: " + distance);

		var otype = "aggregate";    
		otype = "geonear";

		if( sensor == "L8" ){
	    
		    /* solution one:
		       use aggregate() to pipe geoNear and geoIntersects
		    */
		    L8Collection.aggregate([{
			    $geoNear: {
				near: { type: "Point", coordinates: [ lng , lat ] },
				    maxDistance: 1250,
				    distanceField: "dist.calculated",
				    query: {
				    "geometry":{
					"$geoIntersects":{
					    "$geometry":{
						"type":"Point",
						    "coordinates":[
								   lng,
								   lat
								   ]
						    }
					}
				    }
				},
					spherical: true

				    }
			}
			],function(err, docs){
			    console.log("in searching");
			    if(err){
				
				// errors with database
				var dataJson = {};
				dataJson.error = err;
				console.log(err);
				res.json(dataJson);

			    } else {
				var count = 0;
				var coords = [];
				var filenames = [];

				// get two arrays of list and coordinates
				var list = buildLocationList(docs, distance, coords);
				
				if( list.length == 0 ){
				    // no files found
				    var dataJson = {};
				    dataJson.error = "No files found.";
				    res.json(dataJson);
				}
				else{
				    
				    console.log("Files found: " + list.length);
			    
				    for( i = 0; i < list.length; i++ )
					filenames.push(list[i].filename);

				    // create temp file for input and output for GDAL exec
				    var fs = require('fs');
				    var temp = require('temp');
				    var tempName1 = temp.path({suffix: '.txt'});
				    var outName = temp.path({suffix: '.txt'});

				    // lat/long/radius/transparency
				    console.log("lat:");
				    console.log(String(lat));
				    var i;
				    console.log("inFile: " + tempName1);
			    
				    // build the contents of string for input file
				    var strline = "TYPE:Radius";
				    strline += " " + String(lat);
				    strline += " " + String(lng);
				    strline += " " + String(distance);
				    for( i = 0; i < list.length; i++ ){
					var obj = Object(list[i]);
					strline += " " + obj.imagename;
				    }
			    
				    // save to the input file
				    var fs = require('fs');
				    var bSuccess = true;
				    try{
					fs.writeFileSync(tempName1, strline);
				    }catch (e){
					console.log("Cannot write file ", e);
					bSuccess = false;
				    }

				    if( bSuccess == false) {
					// cannot get output file
					var dataJson = {};
					dataJson.error = "Cannot set input data.";
					res.json(dataJson);
				    }
				    else{
					// found the output file
					console.log("Write file: " + bSuccess);
					console.log("Files to write: " + strline);
				    
					// set GDAL exec
					var exename = "C:/rsa/build64-2015/rsa/x64/Debug/l8rgbclip.exe ";
					exename += tempName1 + " " + outName;    

					console.log("input File: " + tempName1);
					console.log("out File: " + outName);

					console.log("running executable");
					console.log(exename);
				    
					// run exec
					var cp = require('child_process');  
					cp.execSync(exename);
					console.log("executable finished");

					console.log("RGBFILE:OUTFILE");

					var outFiles = [];
					var stats = fs.existsSync(outName);
					
					if( stats != true ){
					    var dataJson = {};
					    dataJson.error = "Cannot found output data.";
					    res.json(dataJson);
					}
					else{
					    
					    // use line reader to read the output file
					    var lineReader = require('readline').createInterface({
						    input: fs.createReadStream(outName)
						});

					    // read line one by one
					    lineReader.on('line', function (line) {
						    console.log("line: " + line);

						    var arrays = line.trim().split(";");
						    console.log("Line seg length: " + arrays.length);

						    if( arrays.length == 2 && 
							arrays[1] != "NONE" ){
							outFiles.push(arrays[0]);
							outFiles.push(arrays[1]);
						    }	
						}).on('close', function() {
							
							// build the json object
							if( outFiles.length > 0 ){
							    var dataJson = {};
							    dataJson.width = 128;
							    dataJson.height = 128;
							    dataJson.imgtype = "bmp";
							    dataJson.sensor = "L8";
							    dataJson.error = "None";
							    dataJson.data = [];
							    for( i = 0; i < outFiles.length; i+=2){
								// get input file name
								var rgbname = outFiles[i];
								var outname = outFiles[i+1];
								//console.log("outFiles imgnam: " + rgbname);

								bFound = false;
								var timeseg = "";
						    
								for( var j = 0; j < list.length; j++ ){
								    var obj = Object(list[j]);
							
								    //console.log("obj imgname: " + obj.imagename);

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
								    var img = {
									time: timeseg,
									rgbfile:rgbname,
									imgdata:buf
								    };
								    dataJson.data.push(img);
								}
							    }
						
							    // send back to the client
							    console.log("json length: " + dataJson.data.length);
							    if( dataJson.data.length == 0 ){
								dataJson.error = "No files found.";
								res.json(dataJson);
							    }
							    else{

								for( i = 0; i < dataJson.data.length; i++ ){
								    console.log( i+1+":"+dataJson.data[i].rgbfile );
								}

								res.json(dataJson);
							    }
							}
							else{
							    var dataJson = {};
							    dataJson.error = "No files found.";
							    res.json(dataJson);
							}
						
						    });
					}
				    }
			    }

			}
				       
		    }

		    );
		}
		else {
		
		    /*	
			Solution two:
			Only use geoNear to find documents near to the given point
		    */
	  
		    var point = {
			type: "Point",
			coordinates: [lng, lat]
		    };
		    var geoOptions =  {
			spherical: true,
			//maxDistance: meterConversion.kmToM(maxDistance),
			maxDistance: distance
		    };
	   
		    L8Collection.geoNear(point, geoOptions, function(err, results, stats) {
			var locations;
			console.log('Geo Results', results);
			console.log('Geo stats', stats);
			if (err) {
			    console.log('geoNear error:', err);
			    //sendJsonResponse(res, 404, err);
			} else {
			    locations = buildObjLocationList( results, distance);
			    console.log("Location: " + locations);
			    //sendJsonResponse(res, 200, locations);
			    res.json(locations);
			}
		    });
	    
		    console.log("In DB1");
		}
	    
	    }
	    
	}
	else {
	    console.log("In within");

	    // for within query
	    L8Collection.find({
		    geometry: {
			$geoWithin: {
			    $geometry:{
				type: "Polygon",
				    coordinates:[[
					       [-124.0,48.0],
					       [-140.0,60.0],
					       [-140.0,65.5],
					       [-58.6, 65.5],
					       [-52.0, 45.8],
					       [-82,7, 42.0],
					       [-95.0, 49.0],
					       [-124.0,48.0]
					       ]]
				    }
			}
		    }
		}, function(err, docs){
		    console.log("in searching");
		    if(err){
			console.log(err);
		    } else {
			var coords = [];
			var filenames = [];

			// get two arrays of list and coordinates
			var list = buildLocationList(docs, 0, coords);
			for( i = 0; i < list.length; i++ ){
			    var strname = list[i].filename + "\n";
			    console.log(strname);
			    filenames.push(strname);
			}
		
			var fs = require('fs');
			
			// always add a "'" between lines  - ?
			var stream = fs.createWriteStream("C:/tmp/canada_l8.txt");
			var count = 0;
			for( i = 0; i < filenames.length; i++ ){
			    if( filenames[i].search("_RT") < 0 ){
				stream.write( filenames[i] );
				count++;
			    }
			}
			stream.end();
			
			// send data back to client
			
			console.log("Totol count:" + count);

			res.json(docs);
		    }
		}
		)
		}

	//res.json([{"name":"Hello Yun!"}]);

    }
    else
	res.json([{"name":"Hello Yun!"}]);
    
};
    
