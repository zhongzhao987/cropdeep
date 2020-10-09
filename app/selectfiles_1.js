var url   = require('url');
var L8Collection = require('./models/l8collection');

var http = require('http');
var queryString = require('querystring');

var meterConversion = (function() {
    var mToKm = function(distance) {
        return parseFloat(distance / 1000);
    };
    var kmToM = function(distance) {
        return parseFloat(distance * 1000);
    };
    return {
        mToKm : mToKm,
        kmToM : kmToM
    };
})();

var buildLocationList = function(req, res, results, stats) {
    var locations = [];
    results.forEach(function(doc) {
	    console.log("filename: " + doc.obj.filename);
	    console.log("cloud: " + doc.obj.cloud);
	    console.log("date: " + doc.obj.date);
        locations.push({
            distance: 2500, 
            filename: doc.obj.filename,
            cloud: doc.obj.cloud,
            date: doc.obj.date,
            _id: doc.obj._id
		    
        });
    });
    return locations;
};

/*
var buildLocationList = function(req, res, results, stats) {
    var locations = [];
    results.forEach(function(doc) {
        locations.push({
            distance: meterConversion.mToKm(doc.dis), 
            name: doc.obj.name,
            address: doc.obj.address,
            rating: doc.obj.rating,
            facilities: doc.obj.facilities,
            _id: doc.obj._id
        });
    });
    return locations;
};
*/

module.exports = function SelectFiles(app, req, res) { 
    if( req.path == "/api/maploc") {
	console.log("In GET");

	console.log(L8Collection.count());
  
	var distance=-1.0, lng, lat, sensor, cloud, sttime,endtime;
	// get query params as object
	if (req.url.indexOf('?') >= 0) {
	    oQueryParams = queryString.parse(req.url.replace(/^.*\?/, ''));

	    var params = require('util').inspect(oQueryParams);
	    var obj = eval("(function(){return " + params + ";})()");
	    console.log(obj.sensor);
	    console.log(obj.longitude);
	    console.log(obj.latitude);
	    console.log(obj.starttime);
	    console.log(obj.endtime);
	    console.log(obj.cloud);
	    console.log(obj.distance);

	    distance = Number(obj.distance);
	    lng = Number(obj.longitude);
	    lat = Number(obj.latitude);
	    sensor = obj.sensor;
	    cloud = obj.cloud;
	    sttime = obj.starttime;
	    endtime = obj.endtime;
	}

	if( distance > 0 ){
	    
	    console.log("In DB");

	    var point = {
		type: "Point",
		coordinates: [lng, lat]
	    };
	    var geoOptions =  {
		spherical: true,
		//maxDistance: meterConversion.kmToM(maxDistance),
		maxDistance: 2500,
		num: 10
	    };
	    /*
	    L8Collection.geoNear(point, geoOptions, function(err, results, stats) {
		    var locations;
		    console.log('Geo Results', results);
		    console.log('Geo stats', stats);
		    if (err) {
			console.log('geoNear error:', err);
			//sendJsonResponse(res, 404, err);
		    } else {
			locations = buildLocationList(req, res, results, stats);
			console.log("Location: " + locations);
			//sendJsonResponse(res, 200, locations);
			res.json(locations);
		    }
		});
	    */
	    L8Collection.geoIntersects(point, geoOptions, function(err, results, stats) {
		    var locations;
		    console.log('Geo Results', results);
		    console.log('Geo stats', stats);
		    if (err) {
			console.log('geoNear error:', err);
			//sendJsonResponse(res, 404, err);
		    } else {
			locations = buildLocationList(req, res, results, stats);
			console.log("Location: " + locations);
			//sendJsonResponse(res, 200, locations);
			res.json(locations);
		    }
		});


	    console.log("In DB1");
	    

	 
		
	    /*
	    query.exec( function (err, filedata) {
		    if (err) {
			console.log(err);
			throw err;
		    }

		    if (!filedata) {
			res.json({});
		    } else {
			console.log('Cant save: Found city:' + filedata);
			res.json(filedata);
		    }

		});
	    */
	}

	//res.json([{"name":"Hello Yun!"}]);

    }
    else
	res.json([{"name":"Hello Yun!"}]);
    
};
    
