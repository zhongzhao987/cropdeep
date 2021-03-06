var SliderMethod = require('./slider/slider.js');
var plusSlides = SliderMethod.plusSlides;
var currentSlide = SliderMethod.currentSlide;
var addImages = SliderMethod.addImages;
var addSlideArrays = SliderMethod.addSlideArrays;
var addSlideDots = SliderMethod.addSlideDots;
var displaySlide = SliderMethod.displaySlide;
var hideSlide = SliderMethod.hideSlide;
var setSlideshow = SliderMethod.setSlideshow;
var showSlides = SliderMethod.showSlides;

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

// query the server for the given point 
$(document).ready(function(){
    $("#selectedParams").click(function(){


	    var lng = $('#longitude').val();
	    var lat = $('#latitude').val();
	    var Ldistance = $('#distance').val();
	    if( Ldistance == 0 )
		Ldistance = 1250;
	    else if( Ldistance == 1 )
		Ldistance = 2500;
	    else if( Ldistance == 2 )
		Ldistance = 5000;
	    else
		alert( "distance wrong!");

	    //var areacover = $('#areatocover').val();
	    var Lsensor = $('#sensor').val();
	    if(Lsensor ==0 )
		Lsensor = "L8";
	    else if( Lsensor==1)
		Lsensor = "S1";
	    else if( Lsensor==2)
		Lsensor="S2";
	    else
		alert("Sensor wrong!");

	    var Lcloud = $('#cloud').val();
	    if( Lcloud == 0 )
		Lcloud = 5;
	    else if( Lcloud == 1 )
		Lcloud = 10;
	    else if( Lcloud == 2 )
		Lcloud = 15;
	    else if( Lcloud == 3 )
		Lcloud = 20;
	    else
		Lcloud = 10;
	
	    var temperature = $('#surfTemp').val();
	    alert(temperature);

	    var surfRef =  $('#surfRef').val();
	    var ndvi = $('#ndvi').val();
	    var temperature = $('#surfTemp').val();
	    var moisture = $('#surfMoist').val();
	    var surfrad = $('#surfRad').val();
	    var evaptrans = $('#evaptrans').val();
	    var soiltype = $('#soilType').val();
	    var dem = $('#dem').val();
	    var precip =  $('#precip').val();
	    var wind =  $('#wind').val();
	    var drought =  $('#drought').val();
	    var forcast =  $('#forcat').val();

	    var Lsttime = $('#dp4').val();
	    var Lendtime = $('#dp5').val();
	   
	    // for within polygon
	    var poly = [];
	    var operType = "near"; 
	    if( operType == "within" )
		{ 
		    // canada boundary
		    poly.push(-124.0);
		    poly.push(48.0);
		    poly.push(-140.0);
		    poly.push(60.0);
		    poly.push(-140.0);
		    poly.push(65.5);
		    poly.push(-58.6);
		    poly.push(65.5);
		    poly.push(-52.0);
		    poly.push(45.0);
		    poly.push(-82.7);
		    poly.push(42.0);
		    poly.push(-95.0);
		    poly.push(49.0);
		    poly.push(-124.0);
		    poly.push(48.0);
		};


	    alert($('#surfTemp').val());
	    var surfRef =  $('#surfRef').val().toString();
	    var ndvi = $('#ndvi').val().toString();
	    var temperature = $('#surfTemp').val().toString();
	    var moisture = $('#surfMoist').val().toString();
	    var surfrad = $('#surfRad').val().toString();
	    var evaptrans = $('#evaptrans').val().toString();
	    var soiltype = $('#soilType').val().toString();
	    var dem = $('#dem').val().toString();
	    var precip =  $('#precip').val().toString();
	    var wind =  $('#wind').val().toString();
	    var drought =  $('#drought').val().toString();
	    var forcast =  $('#forcat').val().toString();

	    var mapROI = [];
	    var obj = {
		longitude: lng,
		latitude: lat,
		distance: Ldistance,
		sensor : Lsensor,
		cloud : Lcloud,
	
		reflectance:surfRef,
		ndvi:ndvi,
		temperature:temperature,
		moisture:moisture,
		radiation:surfrad,
		evap:evaptrans,
		soiltype:soiltype,
		dem:dem,
		precipitation:precip,
		wind:wind,
		drought:drought,
		forcast:forcast,
	
		starttime : Lsttime,
		endtime : Lendtime,
		// near - for normal query
		// within - back process - given a polygon to find its inside documents
	
		queryType: operType,
		polygon: poly
	    };

	    // convert to json type
	    mapROI.push(obj);
	    var jsonArray = JSON.parse(JSON.stringify(mapROI));
	    
	    var images = [];
	    
	    $.ajax({
		    // query server
		    type: "GET",
			crossDomain: true,
			url: "/api/maploc",
			data:  obj,
			dataType: "json",
			success: function (result) {
			
			//alert(result);
			
			var strline = "";
			if( result.error == "None" ){
			    if( result.image != NULL ){
				var imgJson = result.image;
				setSlideshow(imgJson);
				displaySlide();
			    }
			    if( result.temperature != NULL ){
				alert("In temperature.");
				alert(result.temperature);
			    }
			    
			    setTimeout(function() {
				    showSlides(1);
    
				},1000) ;

			    alert("done");
	    
			}
			else {
			    alert("error");
			    }
			
			
			var as = json2array(result);

			var str = "";
			for( i = 0; i < as.length-1; i++ )
			    str += as[i] + "\n";
			//alert(str);
			
			
			//do somthing here
		    }
		});
	     		       
    });
});