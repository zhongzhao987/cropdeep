(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SliderMethod = require('./slider/slider.js');
var setSlideshow = SliderMethod.setSlideshow;
var showSlides = SliderMethod.showSlides;
var displaySlide = SliderMethod.displaySlide;
var hideSlide = SliderMethod.hideSlide;


function addImages( index, total, data, time, slide){
    $('<div class="mySlides fade"><div class="numbertext">'+index+' / '+total+'</div><img src="data:image/bmp;base64",'+data+' style="width:128"><div class="text">'+time+'</div></div>').appendTo(slide);
}

function addSlideArrays(slide){
    $('<a class="slideprev" onclick="plusSlides(-1)">&#10094;</a><a class="slidenext" onclick="plusSlides(1)">&#10095;</a>').appendTo(slide);
}

function addSlideDots(i, slidedot){
   var name = "currentSlide("+i+")";
   $('<span class="dot" onclick='+name+'></span>').appendTo(slidedot);
}

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
		alert("Cloud wrong!");
	    
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


	    var mapROI = [];
	    var obj = {
		longitude: lng,
		latitude: lat,
		distance: Ldistance,
		sensor : Lsensor,
		cloud : Lcloud,
		starttime : Lsttime,
		endtime : Lendtime,
		// near - for normal query
		// within - back process - given a polygon to find its inside documents
       
		queryType: operType,
		polygon: poly
	    };


	    mapROI.push(obj);
	    var jsonArray = JSON.parse(JSON.stringify(mapROI));
	    
	    var images = [];
	    
	    $.ajax({
		    type: "GET",
			crossDomain: true,
			url: "/api/maploc",
			data:  obj,
			dataType: "json",
			success: function (result) {
		
			//	alert(result);
			
			//	alert(result.data.length);

			var strline = "";
			if( result.error == "None" ){
			    if( result.data.length > 0 ){
				setSlideshow(result);
			    }
			    
			    displaySlide();

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
},{"./slider/slider.js":2}],2:[function(require,module,exports){

//https://www.w3schools.com/howto/howto_js_slideshow.asp

var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

module.exports = {
    displaySlide:function(){
	$('.slideshow-container')[0].style.display = 'block';
	$('.slideshow-container')[0].style.visibility = 'visible';
    },

    hideSlide:function(){
	$('.slideshow-container')[0].style.display = 'none';
	$('.slideshow-container')[0].style.visibility = 'none';
    },
   
    
    
    setSlideshow:function(result) {

    var imgCount = result.data.length;
    var pixels = result.width;
    var rows = result.height;
    var sensor = result.sensor;
    var distance = result.distance;
   
    images = [];
    var obj;
    var i;
    var strline = "";
    for( i = 0; i < result.data.length; i++ ){
	obj = result.data[i];
	strline += obj.time + " ";
	var data = obj.imgdata;
	images.push(obj);
    }
    
    var slides = document.getElementsByClassName("slideshow-container");
    for( i = 0; i < imgCount; i++ ){
	var index = i+1;
	var total = imgCount;
	var data = result.data[i].img;
	var time = result.data[i].time;
	$('<div class="mySlides fade"><div class="numbertext">'+index+' / '+total+'</div><img src="data:image/bmp;base64",'+data+' style="width:128"><div class="text">'+time+'</div></div>').appendTo(slides);
    }	

    $('<a class="slideprev" onclick="plusSlides(-1)">&#10094;</a><a class="slidenext" onclick="plusSlides(1)">&#10095;</a>').appendTo(slides);

    
    /*
    var prev = $('.slideprev');
    var next = $('.slidenext');
    slides.append(imgs, prev, next);
    */

    var dots = document.getElementsByClassName("slideshow-dot");
    for( i = 1; i <= imgCount; i++ ){
	var name = "currentSlide("+i+")";
	$('<span class="dot" onclick='+name+'></span>').appendTo(dots);
    }
   
    $('#services').append(slides);
    
    //$('.slideshow-dot').style.display = 'block';
    // $('.slideshow-dot').style.visibility = 'visible';
    $('.slideshow-container')[0].style.display = 'block';
    $('.slideshow-container')[0].style.visibility = 'visible';

    //displaySlide();

    },

    showSlides:function(n){
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("slideshow-dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
	slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
	dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    slides[slideIndex-1].style.visibility = 'visible';
    dots[slideIndex-1].className += " active";
    
} 
}
},{}]},{},[1]);
