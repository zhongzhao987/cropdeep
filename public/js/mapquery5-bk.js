var slideIndex = 1;


function  plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}
 
function addImages( index, total, data, time, slide){
    //var slides = document.getElementsByClassName("slideshow-container");
    var myslides = document.createElement("div");
    //myslides.setAttribute("class", "mySlides fade" );
    myslides.setAttribute("class", "mySlides" );
    myslides.setAttribute("align", "center");

    //var text1 = '<div class="numbertext">'+index+' / '+total+'</div>';
    //$(text1).appendTo(myslides);
    //var img1 = '<img id="image" src=C:\\image\\cellphon\\show\\'+index+'.png>';
    //<img src="data:image/bmp;base64",'+data+' style="width:512">
    var imgdata="data:image/bmp;base64,"+data;
    //alert(imgdata);
    var img1 = '<img src='+imgdata+'>';
    //alert(img1);
    $(img1).appendTo(myslides);

    var text2 = '<div class="slidetext">'+time+'</div>';
    $(text2).appendTo(myslides);

    $('.slideshow-container').append(myslides);
}

function addSlideArrays(slide){
    $('<a class="slideprev" onclick="plusSlides(-1)">&#10094;</a><a class="slidenext" onclick="plusSlides(1)">&#10095;</a>').appendTo(slide);
}

function addSlideDots(i, slidedot){
    var name = "currentSlide("+i+")";
    $('<span class="dot" onclick='+name+'></span>').appendTo(slidedot);
}

function displaySlide(){
    $('.slideshow-container')[0].style.display = 'block';
    $('.slideshow-container')[0].style.visibility = 'visible';
    $('.dots')[0].style.display = 'block';
    $('.dots')[0].style.visibility = 'visible';
}

function  hideSlide(){
    $('.slideshow-container')[0].style.display = 'none';
    $('.slideshow-container')[0].style.visibility = 'none';
    $('.dots')[0].style.display = 'none';
    $('.dots')[0].style.visibility = 'none';
}

function setSlideshow(result, type, images) {
    
    var imgCount = result.data.length;
    var pixels = result.width;
    var rows = result.height;
    var sensor = result.sensor;
    var distance = result.distance;
   
    //images = [];
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
    $('.slideshow-container').empty();
    for( i = 0; i < imgCount; i++ )
	addImages( i+1, imgCount, result.data[i].imgdata, result.data[i].time, slides);

    // add prev and next arraws
    var imgs = $('.mySlides');
    addSlideArrays(slides);
 
    // add dots
    var dots = document.getElementsByClassName("dots");
    $('.dots').empty();
    for( i = 1; i <= imgCount; i++ ){
	addSlideDots(i, dots);
    }
}

function showSlides(n){
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) 
	{slideIndex = 1}
    else if (n < 1) 
	{slideIndex = slides.length}
   
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
	    
	    var Lsttime = $('#dp4').val();
	    var Lendtime = $('#dp5').val();
	   
	    var surfRef =  $('#surfRef').val();
	    var ndvi = $('#ndvi').val();
	    var temperature = $('#surfTemp').is(':checked');
	    var moisture = $('#surfMoist').val();
	    var surfrad = $('#surfRad').val();
	    var evaptrans = $('#evaptrans').val();
	    var soiltype = $('#soilType').val();
	    var dem = $('#dem').val();
	    var precip =  $('#precip').val();
	    var wind =  $('#wind').val();
	    var drought =  $('#drought').val();
	    var forcast =  $('#forcat').val();

	    alert( "Temp: " + temperature );


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
				
			var strline = "";
			if( result.error == "None" ){
			    var data = null;
			    if( result.l8image != null )
				data = result.l8image;
				
			    if( data.data.length > 0 ){
				setSlideshow(data);
			    }
			    displaySlide();

			    setTimeout(function() {
				    showSlides(1);
    
				},0) ;

			    if( temperature == true && result.temperature != null ) {
				data = result.temperature;
				alert("in temperature");
				alert(data);
			    }

			    //alert("done");
	    
			}
			else {
			    alert( result.error );
			    }	
			
			//do somthing here
		    }
		});
	     		       
    });
});