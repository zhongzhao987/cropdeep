var url   = require('url');

// Get the collection in the database
var L8Collection = require('./models/l8collection');
var ModisCanadaFootprint = require('./models/modis_canada_footprint');
var CanadaMod11A2 = require('./models/canada_mod11a2');
var CanadaMod09Q1 = require('./models/canada_mod09q1');
var CanadaMod13Q1 = require('./models/canada_mod13q1');
var CanadaCounty = require('./models/canada_county');

var http = require('http');
var queryString = require('querystring');
var async = require('async');

var utils = require('./utils');

var buildLocationList = function(results, dis) {
    var arr = [];
    var uniqtimes = [];
    results.forEach(function(doc) {
	    console.log("filename: " + doc.filename);
	    
	    // only handle t1 type now
	    if( doc.filename.indexOf("_T1") !== -1){
	    
		var geom = doc.geometry; 
		var coords = geom.coordinates;
		//console.log("coordinates length: " + coords.length);
		var coordinates = coords[0];

		var array = [];
		array.push(coordinates[0].slice());
		array.push(coordinates[1].slice());
		array.push(coordinates[2].slice());
		array.push(coordinates[3].slice());
		array.push(coordinates[4].slice());
		//coordArray.push(array.slice());

		var imagefile   = process.env.RASTER_DATA_DIR;
		//var imagefile = "C:\webs\node-todo\node-todo-master\data";
		//console.log("raster dir: " + imagefile);

		var filename = doc.filename;
		var instr = filename.split("/");
		var len = instr.length;
		if( len == 1 )
		    instr = filename.split("\\");
	    
		var bExt = false;
		var timeseg = "";
		if( len > 1 ){
		    var basename = instr[len-2];
		    //console.log("basename: " + basename);
		    
		    // find time in the base name, only get one image for one time 
		    // because files may come from different path and rows and 
		    // duplicated
		    var namesegs = basename.split("_");
		    timeseg = namesegs[3];
		    //console.log("File Timing: " + timeseg);
		    if( uniqtimes.indexOf(timeseg) < 0 ){
			uniqtimes.push(timeseg);
		    
			var imgname = basename + "_rgb.tif";
			//console.log( "imagefile: " + imgname);

			imagefile = imagefile.concat( "/l8/collection/rgb/");
			imagefile = imagefile.concat( imgname);
		
			//console.log("inputFile: " + filename);
			//console.log("imageFile: " + imagefile);
		
			var fs = require('fs');
			bExt = fs.existsSync(imagefile);
		
			//console.log("File existing: " + bExt);
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

    // need to reorder file name base on the time
    var loc = [];
    var count = 0;
    //console.log("data len: " + arr.length);
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

	    //console.log("Loc pushed: " + count);
	    //console.log("pushed time: " + String(obj0.timeseg));
	    
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
	    
	    //console.log("index1: " + index1);
	    //console.log("filename: " + String(obj2.imagename));
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

	    //console.log("Loc pushed: " + count);
	    //console.log("pushed time: " + String(obj2.timeseg));
	}
	count++;
	//console.log("loop count: " + count);
	//console.log("data len: " + arr.length);
	//console.log("Array left: " + arr);

    }

    console.log("Filse found: " + loc.length);
  
    return loc;
};

/*
Data records got from DB is l8 rgb tif file names
*/
var buildNewLocationList = function(results, dis) {
    var arr = [];
    var uniqtimes = [];
    results.forEach(function(doc) {
	var filename =  doc.filename;
	var otime = doc.date.toISOString().slice(0,10);
	console.log("filename: " + doc.filename);
	console.log("time: " + otime);
	arr.push({
	    "distance": String(dis), 
	    "filename": String(doc.filename),
	    "imagename": String(doc.filename),
	    "cloud": String(doc.cloud),
	    "timeseg": String(otime),
	    "date": String(doc.date),
	    "_id": String(doc._id)
		    
	});
    });
    return arr;
};

var buildPrecipitationList = function( imagedir, sttime, year, begin, end){
    var arr = [];
    var filename = "";
    if( sttime.indexOf("2017") >= 0 )
	filename = imagedir + "/2017-precip.tif";
    else if( sttime.indexOf("2016") >= 0 )
	filename = imagedir + "/2016-precip.tif";
    else if( sttime.indexOf("2015") >= 0 )
	filename = imagedir + "/2015-precip.tif";
    else if( sttime.indexOf("2014") >= 0 )
	filename = imagedir + "/2014-precip.tif";
    else if( sttime.indexOf("2013") >= 0 )
	filename = imagedir + "/2013-precip.tif";
    if( filename.length > 0 ){
	arr.push({
	    "distance": String(1250), 
	    "filename": String(filename),
	    "imagename": String(filename),
	    "_id": "0"
	});
    }
    return arr;	
}

var GetDateString = function(otime){
    var year = otime.substr(0,4);
    var month = otime.substr(4,2);
    var day = otime.substr(6,2);
    var arr = [];
    arr.push(Number(year));
    arr.push(Number(month));
    arr.push(Number(day));
    return arr;
}

// odata = dd/mm/yyyy
var ConvertStringToDate = function(odata){
    var from = odata.split("/");
    console.log("date size: " + from.length);
    if(from.length == 3 )
	return new Date(from[2], from[1] - 1, from[0]);
    from = odata.split("-");
    if(from.length == 3 )
	return new Date(from[2], from[1] - 1, from[0]);
    return null;
}
    

function daysToYearBeginning(date1) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    var year = date1.getFullYear();
    var date2 = new Date(year, 0, 0);
    
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date2_ms - date1_ms)
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)
}

// 
function convertDaysToYearMonthDay(otime){
    var year = otime.substr(0, 4);
    var days = Number(otime.substr(4,3));
    var oDate = new Date(year, 0, Number(days));
    var month = oDate.getMonth() + 1;
    var day = oDate.getDate();
	 
    var mon, currday;
    if( month < 10)
	mon = "0" + String(month);
    else
	mon =  String(month);
    if( day < 10)
	currday = "0"+String(day);
    else
	currday = String(day);
    var otime2 = String(year)+mon+String(currday);
    return otime2;
}

var buildMoistureList = function( imagedir, type, sttime, endtime, beginning, step){
    var arr = [];

    console.log("start time string: " + sttime);
    console.log("end time string: " + endtime);
    
    var start = ConvertStringToDate(sttime);
    var end =ConvertStringToDate(endtime);
    var startyear = start.getFullYear();
    var endyear = end.getFullYear();

    console.log("Start year:" + startyear);
    console.log("End year:" + endyear);
    
    // make them as the same year now
    if ( endyear != startyear )
	start = new Date(endyear, start.getMonth(), start.getDate());
	
    var startday =  daysToYearBeginning(start);
    var endday =  daysToYearBeginning(end);

    console.log("Startday:" + startday);
    console.log("Endday:" + endday);
    console.log("Step: " + step);
    
    beginning = start.toISOString().substring(0, 10);

    console.log("Beginning: " + beginning);
    
    if( endday < startday )
	return arr;

    // check directory to get filenames
    var resolve = require('path').resolve
    var imgdir =  resolve(imagedir);

    console.log("image dir: " + imgdir);
    
    var fs = require('fs');
    var files = fs.readdirSync(imgdir);
    files.sort();

    console.log("Files found: " + files.length);
    console.log("Day gaps: " + step);

    // file time gaps is 8days, so filter them if needed
    var index = 0;
    var nStep = step;     // for gaps of 8 days
    if( step == 16 )
	nStep = 2;
    else if( step == 32 )
	nStep = 4;
    
    for( var i = 0; i < files.length; i++ ){
	var name = files[i];
	var len = name.length;
	var ext = name.substr(len-3);
	
	//moisture - SMAP_L4_SM_gph_20150408T163000_Vv3030_001-moisture.tif
	//carbon - SMAP_L4_C_mdl_20150331T... -carbon.tif
	
	if( ext == "tif" ){

	    console.log("Filename: " + name);
	    var otime;
	    if( type == "moisture" )
		otime = name.substr(15,8);
	    else
		otime = name.substr(14,8);  // carbon

	    console.log("time: " + otime);
	    var timearr = GetDateString(otime);
	    //console.log("time year: " + timearr[0]);
	    //console.log("time month: " + timearr[1]);
	    //console.log("time day: " + timearr[2]);
	    
	    var odate = new Date( timearr[0], timearr[1] - 1, timearr[2]);
	    var year = odate.getFullYear();
	    if( year != startyear )
		continue;
	    
	    var day = daysToYearBeginning(odate);
	    if( day < startday || day > endday )
		continue;
	    
	    console.log("current total day: " + day);
	    console.log("current index: " + index);
	    console.log("current step: " + nStep);
	    
	    if(  index % nStep == 0 ){
		var filename = imgdir + "/" + name;
		var currtime = odate.toISOString().substring(0, 10);

		console.log(" added filename: " + filename);
		console.log("added time: " + currtime);
		console.log("index: " + index);
		console.log("start day: " +startday);
		console.log("end day: " + endday);
		console.log("current day: " + day);
		arr.push({
		    "distance": String(1250),
		    "startday":startday,
		    "currday":day,
		    "currtime":currtime,
		    "filename": String(filename),
		    "imagename": String(filename),
		    "_id": "0"
		});
	    }
	    index++;
	}
    }
    
    return arr;	
}



var buildNameList = function(results, dis, optype,  year, start, end) {

    console.log("\nIn BuildNameList\n");

    var arr = [];
    var length = results.length;

    var startday =  start;
    console.log("Start to day 1: " + startday);
    var endday =  end;
    console.log("End to day 1: " + endday);
   
    for( var i = 0; i < length; i++ ){
	var otime = results[i].otime;
	console.log("otime: " + otime);
	var name = results[i].filename;
	var len = name.length;
	var imagefile;

	var curryear = otime.substr(0, 4);
	console.log("year: " + curryear);
	if( curryear != year )
	    continue;
	var days = Number(otime.substr(4,3));
	console.log("days: " + days);
	if( days < startday || days > endday)
	    continue;
	
	console.log("name: " + name);
	console.log("time: " + otime);
	
	if( optype == "temperature" ){
	    var basename = name.substring(0, len-4);
	    // change directory
	    var basename1 = basename.replace("download", "output");

	    /*
	      temperature file: C:\images\modis\download\mod11a2\canada\MOD11A2.A2017305.h12v04.006.2017314042610.hdf
	      Image file: C:\images\modis\output\mod11a2\canada\MOD11A2.A2017305.h12v04.006.2017314042610_temperature.tif
	    */

	    console.log("temperature file: " + name);
	    console.log("temperature base file: " + basename1);
	    imagefile = basename1 + "_temperature.tif";
	}
	else if( optype == "reflectance" || optype == "ndvi"){
	    imagefile = name;
	}
	else
	    continue;

	console.log("Image file: " + imagefile);
	
	var fs = require('fs');
	var bExt = fs.existsSync(imagefile);

	console.log("File exist: " + bExt);

	if( bExt ){
	    var oDate = new Date(year, 0, Number(days));
	    var month = oDate.getMonth() + 1;
	    var day = oDate.getDate();
	 
	    console.log("Add to array:")
	    console.log("Year: " + year);
	    console.log("Month: " + month);
	    console.log("Day: " + day);
	    var mon, currday;
	    if( month < 10)
		mon = "0" + String(month);
	    else
		mon =  String(month);
	    if( day < 10)
		currday = "0"+String(day);
	    else
		currday = String(day);
	    var otime2 = String(year)+mon+String(currday);
	    console.log("TIME is: " + otime2);
	    
	    arr.push({
		    "distance": String(dis), 
			"filename": String(name),
			"imagename": String(imagefile),
			"timeseg": String(otime2)
	    });
	}
    }
    return arr;
};


function findTemperatureFiles(ModisFootprint,
			      CanadaMod11A2,
			      lng, lat, distance, next){
    var data = [];
    var zone = [];

    async.series([
		  function(callback){
		      console.log("Footprint searching");
		      ModisFootprint.find({
			      "geometry":{
				  "$geoIntersects":{
				      "$geometry":{
					  "type":"Point",
					      "coordinates":[lng*0.01745329252,lat*0.01745329252]
					      }
				  }
			      }
			  }, function(err, docs){
			      console.log("Searching zone in DB");
			      if(err){
				  callback(err);
			      } 
			      else {		
				  for( var i = 0; i < docs.length; i++ )
				      zone.push(docs[i].zone);
				  console.log("zone length: " + docs.length);
				  if( zone.length == 0 )
				      callback("No zone found");
				  else
				      callback();
			      }
			  }
			  );
		  },
		  function(callback){
		      //console.log("zone found: " + zone[0]);
		      CanadaMod11A2.find( { zone: zone[0] }, function( err, docs ){
			      if(err)
				  callback(err);
			      else {
				  console.log("in Mod11A2:" + docs.length);
				  data.push(docs);
				  callback();
			      }
			  }
			  );
		  }
		  ], function(err){
		     if( err )
			 return next(err);
		     else if( data.length == 0 ){
			 err = "Cannot find temperature files";
			 console.log(err);
			 next(err);
		     }
		     else {
			 next(null, data[0]);
		     }
		 });
};

function findReflectanceFiles(ModisFootprint,
			      CanadaModDB,
			      lng, lat, distance, next){
    var data = [];
    var zone = [];

    async.series([
		  function(callback){
		      console.log("Footprint searching");
		      ModisFootprint.find({
			      "geometry":{
				  "$geoIntersects":{
				      "$geometry":{
					  "type":"Point",
					      "coordinates":[lng*0.01745329252,lat*0.01745329252]
					      }
				  }
			      }
			  }, function(err, docs){
			      console.log("Searching zone in DB");
			      if(err){
				  callback(err);
			      } 
			      else {		
				  for( var i = 0; i < docs.length; i++ )
				      zone.push(docs[i].zone);
				  console.log("zone length: " + docs.length);
				  if( zone.length == 0 )
				      callback("No zone found");
				  else
				      callback();
			      }
			  }
			  );
		  },
		  function(callback){
		      //console.log("zone found: " + zone[0]);
		      CanadaModDB.find( { zone: zone[0] }, function( err, docs ){
			      if(err)
				  callback(err);
			      else {
				  console.log("in Mod09Q1:" + docs.length);
				  data.push(docs);
				  callback();
			      }
			  }
			  );
		  }
		  ], function(err){
		     if( err )
			 return next(err);
		     else if( data.length == 0 ){
			 err = "Cannot find files";
			 console.log(err);
			 next(err);
		     }
		     else {
			 next(null, data[0]);
		     }
		 });
};
	
function findMODISFiles(ModisFootprint,
		       CanadaModDB,
		       lng, lat, distance, next){
    var data = [];
    var zone = [];

    async.series([
		  function(callback){
		      console.log("Footprint searching");
		      ModisFootprint.find({
			      "geometry":{
				  "$geoIntersects":{
				      "$geometry":{
					  "type":"Point",
					      "coordinates":[lng*0.01745329252,lat*0.01745329252]
					      }
				  }
			      }
			  }, function(err, docs){
			      console.log("Searching zone in DB");
			      if(err){
				  callback(err);
			      } 
			      else {		
				  for( var i = 0; i < docs.length; i++ )
				      zone.push(docs[i].zone);
				  console.log("zone length: " + docs.length);
				  if( zone.length == 0 )
				      callback("No zone found");
				  else
				      callback();
			      }
			  }
			  );
		  },
		  function(callback){
		      //console.log("zone found: " + zone[0]);
		      CanadaModDB.find( { zone: zone[0] }, function( err, docs ){
			      if(err)
				  callback(err);
			      else {
				  console.log("in ModDB:" + docs.length);
				  data.push(docs);
				  callback();
			      }
			  }
			  );
		  }
		  ], function(err){
		     if( err )
			 return next(err);
		     else if( data.length == 0 ){
			 err = "Cannot find files";
			 console.log(err);
			 next(err);
		     }
		     else {
			 next(null, data[0]);
		     }
		 });
};
	
	     
/*
 multiple queries:
 1. build temp input and output file for GDAL exe commands
 2. run GDAL commands
 3. get json object from each GDAL run
 4. organize them and send back to client
*/

function getDataFromFiles(dataFiles, lng, lat, distance, year, beginning, ending,  timeInterval,res){
    
    console.log("\nIn GETDATAFROMFILLE\n");

    if( dataFiles.length == 0 ){
	dataJson.error = "Cannot find files to processing";
	res.json(dataJson);
    }

    // create temp files for input and output for GDAL exec
    var fs = require('fs');
    var temp = require('temp');

    var l8Name, l8Outname, tempeName, tempeOutname;
    var ndviName, ndviOutname, reflectName, reflectOutname;

    for( var i = 0; i < dataFiles.length; i++ ){
	if( dataFiles[i].operatetype == "L8Image" ){
	    l8Name = temp.path({suffix: '.txt'});
	    l8Outname = temp.path({suffix: '.txt'});
	}
	else if(dataFiles[i].operatetype == "temperature" ){
	    tempeName = temp.path({suffix: '.txt'});
	    tempeOutname = temp.path({suffix: '.txt'});
	}
	else if(dataFiles[i].operatetype == "reflectance" ){
	    reflectName = temp.path({suffix: '.txt'});
	    reflectOutname = temp.path({suffix: '.txt'});
	}
	else if(dataFiles[i].operatetype == "ndvi" ){
	    ndviName = temp.path({suffix: '.txt'});
	    ndviOutname = temp.path({suffix: '.txt'});
	}
	console.log("Index: " + i);
    }
    
    // loop each query type
    var dataJson = {};
    dataJson.L8Image = null;
    for( var i = 0; i < dataFiles.length; i++ ){
	var docs = dataFiles[i].body;
	var type = dataFiles[i].operatetype;

	console.log("Loop operation type: " + type);

	var exename;
	if( type == "L8Image" ){
	    
	    console.log("\nIn L8IMAGE: " + i);

	    dataJson.L8Image = null;
	    var list = buildNewLocationList( docs, distance);
	    if( list.length > 0 ){
		exename = buildExeCommand( list, lng, lat, distance, 
					   l8Name, l8Outname, type,
					   beginning, ending, timeInterval);
		console.log("EXENAME: " + exename);
		if( exename != "" ){
		    var imgData = runGetDataCommand(exename, l8Outname, list, type);
		    if( imgData.length > 0 )
			dataJson.l8image = imgData[0];
		    
		}
	    }
	}
	else if( type == "temperature" ||
		 type == "reflectance" ||
		 type == "ndvi" ){
	    
	    console.log("\nIn Modis Temp/Ref/NDVI: " + i);

	    dataJson.temperature = null;
	    dataJson.reflectance = null;
	    dataJson.ndvi = null;
	    var list = buildNameList( docs, distance, type,  year, beginning, ending);
	    console.log("Modis file size: " + list.length);
	    if( list.length > 0 ){
		if(  type == "temperature" )
		    exename = buildExeCommand( list, lng, lat, distance, 
					   tempeName, tempeOutname, type,
					       beginning, ending, timeInterval);
		else if( type == "reflectance" )
		    exename = buildExeCommand( list, lng, lat, distance, 
					   reflectName, reflectOutname, type,
					       beginning, ending, timeInterval);
		else
		    exename = buildExeCommand( list, lng, lat, distance, 
					   ndviName, ndviOutname, type,
					       beginning, ending, timeInterval);

		console.log("EXENAME: " + exename);
		if( exename != "" ){
		    var imgData;
		    if(  type == "temperature" )
			imgData = runGetDataCommand(exename, tempeOutname, list, type);
		    else if(  type == "reflectance" )
			imgData = runGetDataCommand(exename, reflectOutname, list, type);
		    else
			imgData = runGetDataCommand(exename, ndviOutname, list, type);
		    if( imgData.length > 0 ){
			if( type == "temperature" )
			    dataJson.temperature = imgData[0];
			else if(  type == "reflectance" )
			    dataJson.reflectance = imgData[0];
			else
			    dataJson.ndvi = imgData[0];
		    }
		}
	    }
	}
    }
    
    var bFound = false;
    for( var i = 0; i < dataFiles.length; i++ ){
	type = dataFiles[i].operatetype;
	if( type == "L8Image" && dataJson.l8image != null ){
	    bFound = true;
	    break;
	}
	else if( type == "temperature" && dataJson.temperature != null ){
	    bFound = true;
	    break;
	}
	else if( type == "reflectance" && dataJson.reflectance != null ){
	    bFound = true;
	    break;
	}
	else if( type == "ndvi" && dataJson.ndvi != null ){
	    bFound = true;
	    break;
	}
    }
    if( bFound == false )
	dataJson.error = "Cannot find data";
    else
	dataJson.error = "None";
   
    res.json(dataJson);
};
   

var FindImages = function ( imageDB,  lng, lat, distance, next){

    console.log("In Image DB: ");

    console.log("long: " + lng);
    console.log("lat: " + lat);
    console.log("distance: " + distance);
    
    var itemList = [];
    async.parallel([ function(callback) {
		imageDB.aggregate([{
			    $geoNear: {
				near: { type: "Point", coordinates: [ lng , lat ] },
				maxDistance: distance,
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
			console.log("in DB searching");
			if(err)
			    callback(err);
			else {
			    itemList.push(docs);
			    callback(); 
			}
		    }
		    ); // aggregate
	    }
	    ],function(err) {
	    if (err) 
		next(err);
	    else 
		next(null, itemList);
	}
	);		
};


var FindCountyImages = function ( countyDB, imageDB,  lng, lat,  next){

    console.log("In FindCountyImages: ");

    console.log("long: " + lng);
    console.log("lat: " + lat);
     
    var itemList = [];
    async.parallel([ function(callback) {
		imageDB.aggregate([{
			    $geoNear: {
				near: { type: "Point", coordinates: [ lng , lat ] },
				maxDistance: distance,
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
			console.log("in DB searching");
			if(err)
			    callback(err);
			else {
			    itemList.push(docs);
			    callback(); 
			}
		    }
		    ); // aggregate
	    }
	    ],function(err) {
	    if (err) 
		next(err);
	    else 
		next(null, itemList);
	}
	);		
};


function FindFilesInZone(CanadaMod, ozones, next){

    var itemList = [];

    if( ozones.length > 0 ){
	var zone = ozone[0];
	var itemList = new Array();
	CanadaMod.find( { zone: ozone }, function( err, docs ){
		if(err)
		    next(itemList);
		else {
		    docs.forEach(function(doc) {
			var imgFile = [];
			imgFile.push(doc.otime);
			imgFile.push(doc.filename);
			itemList.push(imgFile);
			}
			);
		    
		    next(null, itemList);
		}
	    }
	    );
    }
    else{
	var err = "No zone found.";
	next(err, itemList);
    }
};
		

var buildExeCommand = function( list, lng, lat, distance,
				tempName, outName, type,
				beginning, ending, timeInterval){
   
    var filenames = [];

    console.log(" in buildExeCommand.");
    console.log("list length: " + list.length);

    var strline = "TYPE:Radius";
    strline += " " + String(lat);
    strline += " " + String(lng);
    strline += " " + String(distance);
    
    if( type == "L8Image" ){
	/*
	  L8 image may have duplicated date due to the region codes
	  and need to filter out the duped images
	  use the first one for now
	  LC08_L1TP_039024_20170713_20170726_01_T1_rgb.tif
	  LC08_L1TP_039023_20170713_20170726_01_T1_rgb.tif
	  
	  now only for L1TP type
	*/

	var nameMap = new Map();
	for( var i = 0; i < list.length; i++ ){
	    var obj = Object(list[i]);
	    var n = obj.imagename.indexOf("LC08_L1TP");
	    if( n > 0 ){
		// key should be date: 20170726
		var key = obj.imagename.substring(n+17, n+25);
		console.log("key: " + key);
		if( nameMap.has(key) == false){
		    console.log("add file to map");
		    console.log(obj.imagename);
		    nameMap.set(key,  obj.imagename);
		}
	    }
	}
	if( nameMap.size == 0 )
	    return "";
	/*
	var mapAsc = new Map([nameMap.entries()].sort());	
	for (var [key, value] of mapAsc) {
	    strline += " " + value;
	}
	*/
    }
    else {
	for( var i = 0; i < list.length; i++ ){
	    var obj = Object(list[i]);
	    strline += " " + obj.imagename;
	}
    }
			    
    // save to the input file
    var fs = require('fs');
    var bSuccess = true;
    try{
	fs.writeFileSync(tempName, strline);
    }catch (e){
	console.log("Cannot write file ", e);
	return "";
    }
    
    // found the output file
    console.log("Files to write: " + strline);
				    
    // set GDAL exec
    var exename;
    if( type == "L8Image" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/l8rgbclip.exe ";
    else if( type == "S2Image" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/s2rgbclip.exe ";
    else if( type == "S1Image" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/s1clip.exe ";
    else if( type == "temperature" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/modisclip.exe ";
    else if( type == "reflectance" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/modisclip.exe ";
    else if( type == "ndvi" )
	 exename = "C:/rsa/build64-2017/rsa/x64/Debug/modisclip.exe ";
    else if( type == "precip" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/precipclip.exe ";
    else if( type == "moisture" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/smapclip.exe ";
    else if( type == "neeco2" )
	exename = "C:/rsa/build64-2017/rsa/x64/Debug/smapclip.exe ";
    else
	return "";
   
    if( type == "temperature" )
	exename = exename + tempName + " " + outName + " temperature" + " " + timeInterval + " " +  beginning;  
    else if( type == "reflectance"  )
	exename = exename + tempName + " " + outName + " reflectance" + " " + timeInterval + " " +  beginning;  
    else if( type == "ndvi" )
	exename = exename + tempName + " " + outName + " ndvi" + " " + timeInterval + " " +  beginning;
    else if( type == "precip" )
	exename = exename + tempName + " " + outName + " " + timeInterval + " " +  beginning + " " + ending;
    else if( type == "moisture" )
	exename = exename + tempName + " " + outName + " moisture" 
    else if( type == "neeco2" )
	exename = exename + tempName + " " + outName + " neeco2" 
    else
	exename = exename + tempName + " " + outName;

    console.log("TYPE: " + type);
    console.log("input File: " + tempName);
    console.log("out File: " + outName);

    console.log("running executable");
    console.log(exename);
    
    return exename;
};


// ndvi will have ndvi and evi two images out
var addDataToJson = function(fs, dataJson, outFiles, data, type, imgList){
    var index = 0;
  for( var i = 0; i < outFiles.length; i+=2){
      // get input file name
      var rgbname = outFiles[i];
      var outname = outFiles[i+1];
	
      var val1 = -1000, val2;
      var timeseg = "";
      var bFound = false;

      console.log("NDVI FILE length: " + outFiles.length);
      console.log("NDVI DATA length: " + data.length);

      if( type == "ndvi" && 2 * data.length == outFiles.length ){
	  console.log("NDVI Value: " + data[index]);
	  val1 = data[index];
	  index++;
      }
      else if( type == "temperature" ){
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

      console.log("DATA Found: " + bFound);

      if( bFound == true ){
	  console.log("Get Data for: " + type);
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
	  else if( type == "ndvi"  ){
	      var img = {
		      time: timeseg,
		      rgbfile:rgbname,
		      ndvi:val1,
		      imgdata:buf
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


// ndvi will have ndvi and evi two images out
var addCurvedDataToJson = function(dataJson, otime, data){
    var index = 0;
    for( var i = 0; i < data.length; i++){
	var img = {
	    time: otime[i],
	    data:data[i],
	  }
	  dataJson.data.push(img);
      }
};


/*
call c executable to get results
exename - the executable name with parameters
outname - the output file name from executable 
imgList - 
type - 
*/

var runGetDataCommand = function(exename, outname, imgList, type){
    	
    var itemList = [];

    // run exec
    var cp;
    try{
	cp = require('child_process');
    }catch(e){
	console.log("chaid_process error: " + e);
    }
    
    try{
	cp.execSync(exename);
    }catch(e){
	console.log(e);
    }
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
				
	console.log("Read output file: " + outname);
	var outFiles = [];

	var lines = fs.readFileSync(outname, 'utf-8')
	.split('\n')
	.filter(Boolean);

	var otime = [];
	var data2 = [];
	var eviFiles = [];

	if( type == "precip" ){

	    console.log("RunCommand: precip");
	    
	    for( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
		var arrays = line.trim().split(" ");		      
		if( arrays.length < 2  )
		    continue;
		for( var j = 0; j < arrays.length; j+=2 ){
		    var time = convertDaysToYearMonthDay(arrays[j]);
		     otime.push(time);   // arrays[0] - time
		     data2.push(arrays[j+1]);   // arrays[1] - precips
		 }
		console.log(otime);
		console.log(data2);
	    }
	}
	else if( type == "moisture" || type == "neeco2"){

	    console.log("RunCommand: moisture");
	    
	    for( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
		var arrays = line.trim().split(" ");		      
		if( arrays.length < 2  )
		    continue;
		for( var j = 0; j < arrays.length; j+=2 ){
		    otime.push(arrays[j]);   // arrays[0] - time
		    data2.push(arrays[j+1]);   // arrays[1] - precips
		}
		console.log(otime);
		console.log(data2);
	    }
	}
	else if( type != "ndvi" ){
	    for( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
		var arrays = line.trim().split(";");		      
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

	    console.log("NDVI lines: " + lines.length);

	    for( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
		console.log("index: " + i +" " + line);
		var arrays = line.trim().split(";");
		console.log("NDVI Line seg length: " + arrays.length);
		if( arrays.length == 3 ){
		    outFiles.push(arrays[0]);   // arrays[0] - original file
		    outFiles.push(arrays[1]);   // arrays[1] - out bmp file name
		    data2.push(arrays[2]);      // ndvi data
		}
		else if( arrays.length == 2 ){
		    // get evi files
		    eviFiles.push(arrays[0]);   // arrays[0] - original file
		    eviFiles.push(arrays[1]);   // arrays[1] - out bmp file name
		}
	    }
	}

	
	if( type == "precip" || type == "moisture" || type == "neeco2" ){
	    // precip has no images since its resolution is 0.5 degree
	    // it has a chart
	    var dataJson = {};
	    dataJson.width = 128;
	    dataJson.height = 128;
	    dataJson.imgtype = "bmp";
	    dataJson.operatetype = type;
	    dataJson.error = "None";
	    dataJson.data = [];

	    addCurvedDataToJson(dataJson, otime, data2);
	    if( dataJson.data.length > 0 )
		itemList.push(dataJson);
	    return itemList;
	}
	else {
	
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
		
		addDataToJson(fs, dataJson, outFiles, data2, type, imgList);		
		if( type == "ndvi" )
		    addDataToJson(fs, dataJson, eviFiles, [], type, imgList);
		
		// send back 
		console.log("json length: " + dataJson.data.length);
		if( dataJson.data.length > 0 )
		    itemList.push(dataJson);
		return itemList;
		
	    }
	    else
		return itemList;
	}
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

    //console.log("In Path: " + req.path);

    if( req.path == "/api/maploc") {
	console.log("In GET");

	/*
	if(  runCanEnv.length == 0 ){
	    runCanEnv.lat = 0.0;
	    runCanEnv.lon = 0.0;
	    runCanEnv.init = false;
	    runCanEnv.sensorLoaded = false;
	    runCanEnv.temperatureLoaded = false;
	    runCanEnv.reflectanceLoaded = false;
	    runCanEnv.ndviLoaded = false;
	    runCanEnv.precipLoaded = false;
	    runCanEnv.neeco2Loaded = false;
	    runCanEnv.moistureLoaded = false;
	    runCanEnv.evapLoaded = false;
	    runCanEnv.windLoaded = false;
	    runCanEnv.countyLoaded = false;
	}
	    */

	//console.log(L8Collection.count());
  
	var distance=-1.0, lng, lat, sensor, cloud, sttime,endtime;
	var beginning, ending, timeInterval;
	var fileobj = [];
	var obj, start, end;
	var startyear, endyear;
	var temperature, reflectance, ndvi, precip;

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
	    console.log(obj.temperature);
	    console.log(obj.ndvi);
	    console.log(obj.reflectance);
	    console.log(obj.areacover);

	    distance = Number(obj.distance);
	    lng = Number(obj.longitude);
	    lat = Number(obj.latitude);
	    sensor = obj.sensor;
	    cloud = obj.cloud;
	    sttime = obj.starttime;
	    endtime = obj.endtime;

	    console.log("client start time: " + sttime);
	    console.log("client end time: " + endtime);

	    start = ConvertStringToDate(sttime);

	    console.log("Year: " + start.getFullYear());
	    console.log("Month: " + start.getMonth());
	    console.log("Day: " + start.getDate());
	    
	    end = ConvertStringToDate(endtime);
	    startyear = start.getFullYear();
	    endyear = end.getFullYear();

	    // make them as the same year now
	    if ( endyear != startyear )
	    {
		start = new Date(endyear, start.getMonth(), start.getDate());
		startyear = endyear;
	    }
	
	    beginning =  daysToYearBeginning(start);
	    ending =  daysToYearBeginning(end);
	    timeInterval = obj.timeInterval;

	    console.log("Object beginning: " + beginning);
	    console.log("Object ending: " + ending);
	    console.log("Object Interval: " + timeInterval);

	    temperature = obj.temperature;
	    reflectance = obj.reflectance;
	    ndvi = obj.ndvi;
	    precip = obj.precip;
	    moisture = obj.moisture;
	    neeco2 = obj.neeco2;
	    
	    county = true;
	    if( obj.areacover == "" )
		county = false;

	    queryType = obj.queryType;
	    poly = obj.polygon;

	    console.log("Sensor: " + sensor);
	    console.log("Precip: " + precip);
	    /*
	    if( runCanEnv.init == false ){
		runCanEnv.sensor = sensor;
		runCanEnv.sensorLoaded = false;
		runCanEnv.temperatureLoaded = false;
		runCanEnv.reflectanceLoaded = false;
		runCanEnv.ndviLoaded = false;
		runCanEnv.precipLoaded = false;
		runCanEnv.moistureLoaded = false;
		runCanEnv.neeco2Loaded = false;
		runCanEnv.lat = lat;
		runCanEnv.lon = lng;
		runCanEnv.countyLoaded = county;
		runCanEnv.init == true;
	    }
	    else {
		if( runCanEnv.lat != lat ||
		    runCanEnv.lon != lng ){
		    runCanEnv.lat = lat;
		    runCanEnv.lon = lng;
		    runCanEnv.sensor = sensor;
		    runCanEnv.sensorLoaded = false;
		    runCanEnv.temperatureLoaded = false;
		    runCanEnv.reflectanceLoaded = false;
		    runCanEnv.ndviLoaded = false;
		    runCanEnv.precipLoaded = false;
		    runCanEnv.moistureLoaded = false;
		    runCanEnv.neeco2Loaded = false;
		    runCanEnv.countyLoaded = county;
		}
	    }
*/
	    
	}

	if( queryType == "near" ){
	    
	    if( distance == 0 ){
		var dataJson = {};
		dataJson.error = "Distance not right";
		res.json(dataJson);
	    }

	    console.log("Temperature: " + temperature);
	    console.log("Sensor: " + sensor);
	    console.log("Reflectance: " + reflectance);
	    console.log("NDVI: " + ndvi);
	    console.log("Precip: " + precip);
	    console.log("Moisture: " + moisture);
	    console.log("NEECO2: " + neeco2);

	    //console.log("SensorEnv: " + runCanEnv.sensorLoaded);
	    //console.log("PrecipEnv: " + runCanEnv.precipLoaded);
	    
	    // find temperature images
	    var databaseFiles = [];
	    var data = [];

	    if(  //runCanEnv.temperatureLoaded == false &&
		temperature == "true"  && 
		    // runCanEnv.sensorLoaded == false &&
		    sensor == "L8" ){

		console.log("in temperatue ans sensor mode:");

		async.parallel([ 
				function(callback) {
				    FindImages( L8Collection,  lng, lat, distance, function(err, docs){
					    if(err)
						callback(err);
					    else{
						var imgFiles = {};
						imgFiles.operatetype = "L8Image";
						imgFiles.body = docs[0];
						data.push(imgFiles);
						callback();
					    }
					});
				},
				function(callback) {
				    findTemperatureFiles(ModisCanadaFootprint,
							 CanadaMod11A2,
							 lng, lat, distance, function(err, docs){
							     console.log("temperature data:");
							     //console.log(docs);
							     if(err)
								 callback(err);
							     else{								 
								 var tempFiles = {};
								 tempFiles.operatetype = "temperature";
								 tempFiles.body = docs;
								 data.push(tempFiles);
								 callback();
							     }
							 });
				}
				 ], function(err){
				   var dataJson = {};
				   var length = data.length;
				   if( err ){
				       console.log("Query DB error: " + err);
				       dataJson.error = "Cannot find object";
				       res.json(dataJson);
				   }
				   else if ( length == 0 ){
				       console.log("Query DB without records");
				       dataJson.error = "Data empty";
				       res.json(dataJson);
				   }
				   else {
				       // process data
				       console.log("Data size: " + length);	
				       //runCanEnv.sensorLoaded = true;
				       //runCanEnv.temperatureLoaded = true;
				       getDataFromFiles(data, lng, lat, distance, startyear, beginning, ending, timeInterval, res);
				   }
			       }
			       );
	    }
	    else if(  //runCanEnv.temperatureLoaded == false &&
		temperature == "true" ){

		console.log("in TEMPERATAURE:");

		async.parallel([ 
				function(callback) {
				    findTemperatureFiles(ModisCanadaFootprint,
							 CanadaMod11A2,
							 lng, lat, distance, function(err, docs){
							     console.log("temperature data:");
							     //console.log(docs);
							     if(err)
								 callback(err);
							     else{								 
								 var tempFiles = {};
								 tempFiles.operatetype = "temperature";
								 tempFiles.body = docs;
								 data.push(tempFiles);
								 callback();
							     }
							 });
				}
				 ], function(err){
				   var dataJson = {};
				   var length = data.length;
				   if( err ){
				       console.log("Query DB error: " + err);
				       dataJson.error = "Cannot find object";
				       res.json(dataJson);
				   }
				   else if ( length == 0 ){
				       console.log("Query DB without records");
				       dataJson.error = "Data empty";
				       res.json(dataJson);
				   }
				   else {
				       // process data
				       console.log("Data size: " + length);
				      // runCanEnv.temperatureLoaded = true;
				       getDataFromFiles(data, lng, lat, distance, startyear, beginning, ending, timeInterval, res);
				   }
			       }
			       );
	    }
	    else if(  //runCanEnv.reflectanceLoaded == false &&
		reflectance == "true" ){

		console.log("in REFLECTANCE:");

		async.parallel([ 
				function(callback) {
				    findMODISFiles(ModisCanadaFootprint,
							 CanadaMod09Q1,
							 lng, lat, distance, function(err, docs){
							     console.log("reflectance data:");
							     //console.log(docs);
							     if(err)
								 callback(err);
							     else{								 
								 var tempFiles = {};
								 tempFiles.operatetype = "reflectance";
								 tempFiles.body = docs;
								 data.push(tempFiles);
								 callback();
							     }
							 });
				}
				 ], function(err){
				   var dataJson = {};
				   var length = data.length;
				   if( err ){
				       console.log("Query DB error: " + err);
				       dataJson.error = "Cannot find object";
				       res.json(dataJson);
				   }
				   else if ( length == 0 ){
				       console.log("Query DB without records");
				       dataJson.error = "Data empty";
				       res.json(dataJson);
				   }
				   else {
				       // process data
				       console.log("Data size: " + length);
				       //runCanEnv.reflectanceLoaded = true;
				       console.log("beginning time: " + beginning);
				       getDataFromFiles(data, lng, lat, distance, startyear, beginning, ending, timeInterval, res);
				   }
			       }
			       );
	    }
	    else if(  //runCanEnv.ndviLoaded == false &&
		ndvi == "true" ){

		console.log("in NDVI:");

		async.parallel([ 
				function(callback) {
				    findMODISFiles(ModisCanadaFootprint,
							 CanadaMod13Q1,
							 lng, lat, distance, function(err, docs){
							     console.log("ndvi data:");
							     //console.log(docs);
							     if(err)
								 callback(err);
							     else{								 
								 var tempFiles = {};
								 tempFiles.operatetype = "ndvi";
								 tempFiles.body = docs;
								 data.push(tempFiles);
								 callback();
							     }
							 });
				}
				 ], function(err){
				   var dataJson = {};
				   var length = data.length;
				   if( err ){
				       console.log("Query DB error: " + err);
				       dataJson.error = "Cannot find object";
				       res.json(dataJson);
				   }
				   else if ( length == 0 ){
				       console.log("Query DB without records");
				       dataJson.error = "Data empty";
				       res.json(dataJson);
				   }
				   else {
				       // process data
				       console.log("Data size: " + length);
				       //runCanEnv.ndviLoaded = true;
				       getDataFromFiles(data, lng, lat, distance, startyear, beginning, ending, timeInterval, res);
				   }
			       }
			       );
	    }
	    else if(   //runCanEnv.sensorLoaded == false &&
		sensor == "L8" ){

		console.log("in L8 mode: ");
		if( county == false ){
		    FindImages( L8Collection,  lng, lat, distance, function(err, docs){
			var dataJson = {};
			if(err){
			    console.log("Query DB error: " + err);
			    dataJson.error = "Cannot find L8 files";
			    res.json(dataJson);
			}
			else{
			    
			    //process data	       
			    var coords = [];
			    // decode file list
			    var list = buildNewLocationList( docs[0], distance);
			    if( list.length > 0 ){
				// create temp file for input and output for GDAL exec
				var fs = require('fs');
				var temp = require('temp');
				var tempName = temp.path({suffix: '.txt'});
				var outName = temp.path({suffix: '.txt'});
				var type = "L8Image";
				exename = buildExeCommand( list, lng, lat, distance, 
							   tempName, outName, type,
							   beginning, ending, timeInterval);
				console.log("out filename: " + outName);
				console.log("outexename: " + exename);
				if( exename != "" ){
				    var imgData = runGetDataCommand(exename, outName, list, type);
				    if( imgData.length > 0 ){
					dataJson.error = "None";
					dataJson.l8image = imgData[0];
					//runCanEnv.sensorLoaded = true;
					res.json(dataJson);
				    }
				    else{
					dataJson.error = "Cannot get image data";
					res.json(dataJson);
				    }
				}
				else{
				    dataJson.error = "Exe name empty";
				    res.json(dataJson);
				}
			    }
			    else{
				dataJson.error = "Cannot find files for the given position";
				res.json(dataJson);
			    }
			}
		    });
		}
		else {
		    // find county 
		    FindCountyImages( L8Collection,  lng, lat, distance, function(err, docs){
			var dataJson = {};
			if(err){
			    console.log("Query DB error: " + err);
			    dataJson.error = "Cannot find L8 files";
			    res.json(dataJson);
			}
			else{
			    
			    //process data	       
			    var coords = [];
			    // decode file list
			    var list = buildNewLocationList( docs[0], distance);
			    if( list.length > 0 ){
				// create temp file for input and output for GDAL exec
				var fs = require('fs');
				var temp = require('temp');
				var tempName = temp.path({suffix: '.txt'});
				var outName = temp.path({suffix: '.txt'});
				var type = "L8Image";
				exename = buildExeCommand( list, lng, lat, distance, 
							   tempName, outName, type,
							   beginning, ending, timeInterval);
				console.log("out filename: " + outName);
				console.log("outexename: " + exename);
				if( exename != "" ){
				    var imgData = runGetDataCommand(exename, outName, list, type);
				    if( imgData.length > 0 ){
					dataJson.error = "None";
					dataJson.l8image = imgData[0];
					//runCanEnv.sensorLoaded = true;
					res.json(dataJson);
				    }
				    else{
					dataJson.error = "Cannot get image data";
					res.json(dataJson);
				    }
				}
				else{
				    dataJson.error = "Exe name empty";
				    res.json(dataJson);
				}
			    }
			    else{
				dataJson.error = "Cannot find files for the given position";
				res.json(dataJson);
			    }
			}
		    });
		}
	    }
	    else if(   //runCanEnv.precipLoaded == false &&
		precip == "true" ){

		console.log("In precip mode: ");

		console.log("Process raster dir: " + process.env.RASTER_DATA_DIR);

		//var imagedir   = process.env.RASTER_DATA_DIR + "/nocc-cpc/precip";

		var imagedir = "D:/webs/node-todo/node-todo-master/data/raster/noaa-cpc/precip";
		
		console.log("Precip Image Dir: " + imagedir);
		var dataJson = {};

		var list = buildPrecipitationList( imagedir, sttime,  startyear, beginning, ending);

		console.log("Time start at: "+ beginning);
		console.log("Precip File length: " + list.length)
		
		if( list.length > 0 ){
		    // create temp file for input and output for GDAL exec
		    var fs = require('fs');
		    var temp = require('temp');
		    var tempName = temp.path({suffix: '.txt'});
		    var outName = temp.path({suffix: '.txt'});
		    var type = "precip";
		    exename = buildExeCommand( list, lng, lat, distance, 
					       tempName, outName, type,
					       beginning, ending, timeInterval);
		    console.log("out filename: " + outName);
		    console.log("outexename: " + exename);
		    if( exename != "" ){
			var imgData = runGetDataCommand(exename, outName, list, type);
			if( imgData.length > 0 ){
			    dataJson.error = "None";
			    dataJson.precip = imgData[0];
			    //runCanEnv.precipLoaded = true;
			    res.json(dataJson);
			}
			else{
			    dataJson.error = "Cannot get image data";
			    res.json(dataJson);
			}
		    }
		    else{
			dataJson.error = "Exe name empty";
			res.json(dataJson);
		    }
		}
		else{
		    dataJson.error = "Cannot find files for the given position";
		    res.json(dataJson);
		}
	    }
	    else if(  // runCanEnv.moistureLoaded == false &&
		moisture == "true" ){

		console.log("In moisture mode: ");
		console.log("Process raster dir: " + process.env.RASTER_DATA_DIR);
		var imagedir = "data/raster/smap/moisture";
		var type = "moisture";
		var dataJson = {};
		var list = buildMoistureList( imagedir, type, sttime, endtime, beginning, timeInterval);
		
		if( list.length > 0 ){
		    // create temp file for input and output for GDAL exec
		    var fs = require('fs');
		    var temp = require('temp');
		    var tempName = temp.path({suffix: '.txt'});
		    var outName = temp.path({suffix: '.txt'});
		    exename = buildExeCommand( list, lng, lat, distance, 
					       tempName, outName, type,
					       beginning, ending, timeInterval);
		    console.log("out filename: " + outName);
		    console.log("outexename: " + exename);
		    if( exename != "" ){
			var imgData = runGetDataCommand(exename, outName, list, type);
			if( imgData.length > 0 ){
			    dataJson.error = "None";
			    dataJson.moisture = imgData[0];
			    //runCanEnv.moistureLoaded = true;
			    res.json(dataJson);
			}
			else{
			    dataJson.error = "Cannot get image data";
			    res.json(dataJson);
			}
		    }
		    else{
			dataJson.error = "Exe name empty";
			res.json(dataJson);
		    }
		}
		else{
		    dataJson.error = "Cannot find files for the given position";
		    res.json(dataJson);
		}
	    }
	    else if(  // runCanEnv.neeco2Loaded == false &&
		neeco2 == "true" ){

		console.log("In carbon mode: ");
		console.log("Process raster dir: " + process.env.RASTER_DATA_DIR);
		var imagedir = "data/raster/smap/carbon";
		var type = "neeco2";
		var dataJson = {};
		var list = buildMoistureList( imagedir, type, sttime, endtime, beginning, timeInterval);
		
		if( list.length > 0 ){
		    // create temp file for input and output for GDAL exec
		    var fs = require('fs');
		    var temp = require('temp');
		    var tempName = temp.path({suffix: '.txt'});
		    var outName = temp.path({suffix: '.txt'});
		    exename = buildExeCommand( list, lng, lat, distance, 
					       tempName, outName, type,
					       beginning, ending, timeInterval);
		    console.log("out filename: " + outName);
		    console.log("outexename: " + exename);
		    if( exename != "" ){
			var imgData = runGetDataCommand(exename, outName, list, type);
			if( imgData.length > 0 ){
			    dataJson.error = "None";
			    dataJson.neeco2 = imgData[0];
			    //runCanEnv.neeco2Loaded = true;
			    res.json(dataJson);
			}
			else{
			    dataJson.error = "Cannot get image data";
			    res.json(dataJson);
			}
		    }
		    else{
			dataJson.error = "Exe name empty";
			res.json(dataJson);
		    }
		}
		else{
		    dataJson.error = "Cannot find files for the given position";
		    res.json(dataJson);
		}
	    }
	    else
		console.log("way not found:" );
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
			var list = buildLocationList(docs, 0);
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
