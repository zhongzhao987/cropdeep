
var slideflag = "l8image";

var slidepos = {
    l8index :1,
    tempindex :1,
    reflectindex :1,
    ndviindex :1
}

function  plusSlides(n) {
    if( slideflag == "l8image" )
	showSlides(slidepos.l8index += n);
    else if( slideflag == "temperature" )
	showSlides(slidepos.tempindex += n);   
}

function currentSlide(n) {
    if( slideflag == "l8image" )
	showSlides(slidepos.l8index = n);
    else if( slideflag == "temperature" )
	showSlides(slidepos.tempindex = n);   
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
    
    /*
    var $min_span = $('<span>');
    $min_span.attr("class", "slidetext");
    $min_span.html(time);
    myslides.append($min_span);
    */
    
    var text2 = '<div class="slidetext">'+time+'</div>';
    $(text2).appendTo(myslides);
    

    //$('.slideshow-container').append(myslides);
    slide.append(myslides);
}

function addOwlImages( index, total, data, time){

    //var myslides = document.createElement("div");
    //myslides.setAttribute("class", "mySlides fade" );
    //myslides.setAttribute("class", "mySlides" );
    //myslides.setAttribute("align", "center");

    //var text1 = '<div class="numbertext">'+index+' / '+total+'</div>';
    //$(text1).appendTo(myslides);
    //var img1 = '<img id="image" src=C:\\image\\cellphon\\show\\'+index+'.png>';
    //<img src="data:image/bmp;base64",'+data+' style="width:512">
    var imgdata="data:image/bmp;base64,"+data;
    //alert(imgdata);
    var img1 = '<img src='+imgdata+'>';

    var content = '<div class="owl-item">' + img1 + '</div>';
    owl.trigger('add.owl.carousel', [$(content), 0])
        .trigger('refresh.owl.carousel');

    //alert(img1);
    //$(img1).appendTo(myslides);
    
    /*
    var $min_span = $('<span>');
    $min_span.attr("class", "slidetext");
    $min_span.html(time);
    myslides.append($min_span);
    */
    
    //var text2 = '<div class="slidetext">'+time+'</div>';
    //$(text2).appendTo(myslides);
    
    //$('.slideshow-container').append(myslides);
    //slide.append(myslides);
}

function addSlideArrays(slide){
    $('<a class="slideprev" onclick="plusSlides(-1)">&#10094;</a><a class="slidenext" onclick="plusSlides(1)">&#10095;</a>').appendTo(slide);
}

function addSlideDots(i, slidedot){
    var name = "currentSlide("+i+")";
    $('<span class="dot" onclick='+name+'></span>').appendTo(slidedot);
    //$('<span class="dot" onclick='+name+'></span>').appendTo(slidedot);
}

function displaySlide(){
    if( slideflag == "l8image" ){
	var slides  = $( ".l8-slide" ).find( ".mySlides" );
	var dots = $( ".l8-dot" ).find( ".dot" );
	for( var i = 0; i < slides.length; i++ ){
	    slides[i].style.display = 'block';
	    slides[i].style.visibility = 'visible';
	}
	for( var i = 0; i < dots.length; i++ ){
	    dots[i].style.display = 'block';
	    dots[i].style.visibility = 'visible';
	}
    }
    /*
    $('.slideshow-container')[0].style.display = 'block';
    $('.slideshow-container')[0].style.visibility = 'visible';
    $('.dots')[0].style.display = 'block';
    $('.dots')[0].style.visibility = 'visible';
    */
}

function  hideSlide(){
    if( slideflag == "l8image" ){
	var slides  = $( ".l8-slide" ).find( ".mySlides" );
	var dots = $( ".l8-dot" ).find( ".dot" );
	for( var i = 0; i < slides.length; i++ ){
	    slides[i].style.display = 'none';
	    slides[i].style.visibility = 'none';
	}
	
	for( var i = 0; i < dots.length; i++ ){
	    dots[i].style.display = 'none';
	    dots[i].style.visibility = 'none';
	}
    }
	/*
    $('.slideshow-container')[0].style.display = 'none';
    $('.slideshow-container')[0].style.visibility = 'none';
    $('.dots')[0].style.display = 'none';
    $('.dots')[0].style.visibility = 'none';
	*/
}

function setSlideshow(result) {
    
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
    
    var container = document.getElementsByClassName("slideshow-container");
    if( container.length > 0 ) {
	$('.slideshow-container').empty();
	container = document.getElementsByClassName("slideshow-container");
    }

    if( slideflag == "l8image" ){
	var slides = document.createElement("div");
	slides.setAttribute("class", "l8-slide" );
	slides.setAttribute("align", "center");
	for( i = 0; i < imgCount; i++ )
	    addImages( i+1, imgCount, result.data[i].imgdata, result.data[i].time, slides);

	// add prev and next arraws
	addSlideArrays(slides);
	// add dots
	var dots = document.createElement("div");
	dots.setAttribute("class", "l8-dot" );
	dots.setAttribute("text-align", "center");
	for( i = 1; i <= imgCount; i++ ){
	    addSlideDots(i, dots);
	}
	slides.append(dots);
	$('.slideshow-container').append(slides);
	// $('.slideshow-container').append(dots);
    }
}

function showSlides(n){
    var i;
    if ( slideflag == "l8image" ){
	var slides  = $( ".l8-slide" ).find( ".mySlides" );
	var dots = $( ".l8-dot" ).find( ".dot" );
	if (n > slides.length) 
	    {slidepos.l8index = 1}
	else if (n < 1) 
	    {slidepos.l8index = slides.length}
   
	for (i = 0; i < slides.length; i++) {
	    slides[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
	    dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[slidepos.l8index-1].style.display = "block";
	slides[slidepos.l8index-1].style.visibility = 'visible';
	dots[slidepos.l8index-1].className += " active";
    }
    else if( slideflag == "temperature" ){
	if (n > slides.length) 
	    {slidepos.tempindex = 1}
	else if (n < 1) 
	    {slidepos.tempindex = slides.length}
   
	for (i = 0; i < slides.length; i++) {
	    slides[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
	    dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[slidepos.tempindex-1].style.display = "block";
	slides[slidepos.tempindex-1].style.visibility = 'visible';
	dots[slidepos.tempindex-1].className += " active";
    }
} 

/*
var carouselTemplate = '<div class="block"><a class="arr-left">LT</a> <a class="arr-right">RT</a> <div class="owl-carousel"><div><img src="http://i.imgur.com/Ud2JynQ.jpg" width:="100" height="50"/></div><div><img src="http://i.imgur.com/Ud2JynQ.jpg" width:="70" height="50"/></div><div><img src="http://i.imgur.com/Ud2JynQ.jpg" width:="100" height="50"/></div></div></div>';

function createAndBindCarousel($element) {
    // Carousel template
    var $owlCarousel = $(carouselTemplate);

    // Insert carousel into element
    $element.append($owlCarousel);

    // Bind carousel
    $owlCarousel.owlCarousel({
        items : 4,
        lazyLoad : true,
        navigation : false
    });

    // Left arrow
    $owlCarousel.find(".arr-left").click(function(){
      $owlCarousel.trigger('owl.prev');
    });
   // Right arrow
    $owlCarousel.find(".arr-right").click(function(){
      $owlCarousel.trigger('owl.next');
    });
}

// Add a new carousel to #carousels
createAndBindCarousel($("#carousels"));

*/


var getLineData = function(line1, line2, labels, type ){
    var lineChartData = {}; //declare an object
    lineChartData.labels = labels; //add 'labels' element to object (X axis)
    lineChartData.datasets = []; //add 'datasets' array element to object

    lineChartData.datasets.push({}); //create a new line dataset
    var dataset = lineChartData.datasets[0];
    dataset.fill = false;
    dataset.borderColor = "#8e5ea2";
    if( type == "temperature"){
	dataset.label = "High temperature";
	dataset.data = line1;
	lineChartData.datasets.push({}); //create a new line dataset
	dataset = lineChartData.datasets[1];
	dataset.data = line2;
	dataset.label = "Low temperature";
    }
    else if( type == "ndvi"){
	dataset.label = "NDVI";
	dataset.data = line1;
    }
    else if( type == "precip"){
	dataset.label = "Precipitation";
	dataset.data = line1;
    }
    else if( type == "moisture"){
	dataset.label = "Moisture";
	dataset.data = line1;
    }
    else if( type == "neeco2"){
	dataset.label = "Net Ecosystem Exchange of CO2 - gC/(m2.day)";
	dataset.data = line1;
    }
    
    dataset.fill = false;
    dataset.borderColor = "#e8c3b9";
    
    return lineChartData;
};
    
var setElementVisible = function(childs, type, bShow){
    for( var i = 0; i < childs.length; i++ ){
	if( childs[i].id == type ){
	    if( bShow ){
		childs[i].style.display = 'block';
		childs[i].style.visibility = 'visible';
		return;
	    }
	}
    }
};

function InitializeOwlSlideNDVI(carousel,imgCount, result, ndvi){
   
    for (var i = 0; i < imgCount; i++) {
	if( ndvi == true && result.data[i].ndvi > -1000 ){
	    var margin=" style="+'"'+"margin:5px 5px" +'"';
	    var imgdata="data:image/bmp;base64,"+result.data[i].imgdata;
	    var imgdata1 = " title="+result.data[i].time;
	    var imgdata2 = imgdata1 + margin;
	    //var imgdata1 = " figcaption="+result.data[i].time;
	    var imgdata3 = imgdata + imgdata2;
	    var img1 = '<img src='+imgdata3+'>';
	    //content += "<div class=\"item\">" + img1 + "</div>"
	    carousel.append(img1);
	}
	else if( ndvi == false && result.data[i].ndvi <= -1000 ){
	    var margin=" style="+'"'+"margin:5px 5px" +'"';
	    var imgdata="data:image/bmp;base64,"+result.data[i].imgdata;
	    var imgdata1 = " title="+result.data[i].time;
	    var imgdata2 = imgdata1 + margin;
	    //var imgdata1 = " figcaption="+result.data[i].time;
	    var imgdata3 = imgdata + imgdata2;
	    var img1 = '<img src='+imgdata3+'>';
	    //content += "<div class=\"item\">" + img1 + "</div>"
	    carousel.append(img1);
	}
    }

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var num = w / 128;
    item = num;
    var bNav = false;
    var bDots = false;
    var bLoop = false;
    if( num < imgCount )
    {
	bNav = true;
	bDots = true;
	bLoop = true;
    }

    //carousel.html(content);
    carousel.owlCarousel({
	//autoWidth:true,
	loop: bLoop,
        margin: 0,
        nav: bNav,
	dots:bDots,
        items : item
    });
}

function InitializeOwlSlide(carousel,imgCount, result){
    var content;
    for (var i = 0; i < imgCount; i++) {
	var margin=" style="+'"'+"margin:5px 5px" +'"';
	var imgdata="data:image/bmp;base64,"+result.data[i].imgdata;
	var imgdata1 = " title="+result.data[i].time;
	var imgdata2 = imgdata1 + margin;
	//var imgdata1 = " figcaption="+result.data[i].time;
	var imgdata3 = imgdata + imgdata2;
	var img1 = '<img src='+imgdata3+'>';
	//content += "<div class=\"item\">" + img1 + "</div>"
	carousel.append(img1);
    }

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var num = w / 128;
    item = num;
    var bNav = false;
    var bDots = false;
    var bLoop = false;
    if( num < imgCount )
    {
	bNav = true;
	bDots = true;
	bLoop = true;
    }

    //carousel.html(content);
    carousel.owlCarousel({
	//autoWidth:true,
	loop: bLoop,
        margin: 0,
        nav: bNav,
	dots:bDots,
        items : item
    });
}


function AddChartData(key, title, lineData, chartMap){
    var w = window.innerWidth;
    var h = Math.round( w * 0.5);
    document.getElementById(key).height = h;
    document.getElementById(key).width = w;


    document.getElementById(key).style.display = "block";
    var ctx = document.getElementById(key).getContext("2d");
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    var lineChart = new Chart(ctx, {
	type: 'line',
	data: lineData,
	options: {
	    title: {
		display: true,
		text: title
	    }
	}
    });
    if( key == "chart-ndvi" ){
	chartMap.ndvi = lineChart;
	document.getElementById("ndvichart").style.display = "block";
	document.getElementById("ndviT").style.display = "block";
	document.getElementById("ndvi-br").style.display = "block";
    }
    else if ( key == "chart-temperature" ){
	chartMap.temperature = lineChart;
	document.getElementById("tempchart").style.display = "block";
	document.getElementById("temperature").style.display = "block";
	document.getElementById("temperature-br").style.display = "block";
    }
    else if ( key == "chart-precip" ){
	chartMap.precip = lineChart;
	document.getElementById("precipchart").style.display = "block";
	document.getElementById("precip-br").style.display = "block";
    }
    else if ( key == "chart-moisture" ){
	chartMap.moisture = lineChart;
	document.getElementById("moistchart").style.display = "block";
	document.getElementById("moisture-br").style.display = "block";
    }
    else if ( key == "chart-neeco2" ){
	chartMap.neeco2= lineChart;
	document.getElementById("neeco2chart").style.display = "block";
	document.getElementById("neeco2-br").style.display = "block";
    }
}

function InitializeChartTemperature(key, name, result, dataflag, chartMap){
	
    var tempH = [];
    var tempL = [];
    var time = [];
    
    var imgCount = result.data.length;
    for (var i = 0; i < imgCount; i++) {
	tempH.push(result.data[i].ht);
	tempL.push(result.data[i].lt);
	time.push(result.data[i].time);	       
    }
    var lineData = getLineData(tempH, tempL, time, dataflag );

    AddChartData(key, name, lineData, chartMap);
	
}

function InitializeChartNDVI(key, name, result, dataflag, chartMap){

    var anData = [];
    var time = [];
    
    var imgCount = result.data.length;
    for( var i = 0; i < imgCount; i++) {
	// ndvi = -1000 is evi data - no chart
	if( result.data[i].ndvi > -1000 ){
	    anData.push(result.data[i].ndvi);
	    time.push(result.data[i].time);
	}
    }
    var lineData = getLineData(anData, [], time, dataflag );

    AddChartData(key, name, lineData, chartMap);
}

function InitializeChart(key, name, result, dataflag, chartMap){

    var anData = [];
    var time = [];
    
    var imgCount = result.data.length;
    for( var i = 0; i < imgCount; i++) {
	anData.push(result.data[i].data);
	time.push(result.data[i].time);
    }
    var lineData = getLineData(anData, [], time, dataflag );

    AddChartData(key, name, lineData, chartMap);
}


function setOwlSlideshow(result, dataflag) {
    
    var imgCount = result.data.length;
    var pixels = result.width;
    var rows = result.height;
    var sensor = result.sensor;
    var distance = result.distance;
   
    images = [];
    var obj;
    var i;
    var strline = "";
    
    var container = document.getElementsByClassName("slideshow-container");
    if( dataflag == "l8image" ){
	var carousel = $("#owl-demo");
	carousel.trigger('destroy.owl.carousel'); 
	InitializeOwlSlide(carousel,imgCount, result);

	setElementVisible(container[0].childNodes, "owl-demo", true);
	setElementVisible(container[0].childNodes, "landsat8", true);
	setElementVisible(container[0].childNodes, "landsat8-br", true);
	jQuery('.owl-carousel').trigger('refresh.owl.carousel');

    }
    else if( dataflag == "reflectance" ){
	var carousel = $("#owl-reflectance");
	carousel.trigger('destroy.owl.carousel'); 
	InitializeOwlSlide(carousel,imgCount, result);
	setElementVisible(container[0].childNodes, "reflectance", true);
	setElementVisible(container[0].childNodes, "owl-reflectance", true);
	setElementVisible(container[0].childNodes, "reflectance-br", true);
	jQuery('.owl-carousel').trigger('refresh.owl.carousel');
    }
    else if( dataflag == "temperature" ){
	setElementVisible(container[0].childNodes, "tempchart", true);
	setElementVisible(container[0].childNodes, "chart-tempchart", true);	
	InitializeChartTemperature("chart-temperature", "Temperature Changes",
				   result, dataflag, chartMap);

	var owl = $("#owl-temperature");
	owl.trigger('destroy.owl.carousel'); 
	InitializeOwlSlide(owl,imgCount, result);
	setElementVisible(container[0].childNodes, "temperature", true);
	setElementVisible(container[0].childNodes, "owl-temperature", true);
	setElementVisible(container[0].childNodes, "temperature-br", true);
	jQuery('.owl-carousel').trigger('refresh.owl.carousel');

    }
    else if( dataflag == "precip" ){
	InitializeChart("chart-precip", "Precipitation Changes", result, dataflag, chartMap);
	setElementVisible(container[0].childNodes, "precipchart", true);
	setElementVisible(container[0].childNodes, "chart-precip", true);
	setElementVisible(container[0].childNodes, "precip-br", true);
    }
    else if( dataflag == "moisture" ){
	InitializeChart("chart-moisture", "Moisture Changes", result, dataflag, chartMap);
	setElementVisible(container[0].childNodes, "moisturechart", true);
	setElementVisible(container[0].childNodes, "chart-moisture", true);
	setElementVisible(container[0].childNodes, "moisture-br", true);
    }
    else if( dataflag == "neeco2" ){
	var text = "Net Ecosystem Exchange of CO2 - gC/(m2.day)";
	InitializeChart("chart-neeco2", text, result, dataflag, chartMap);
	setElementVisible(container[0].childNodes, "neeco2chart", true);
	setElementVisible(container[0].childNodes, "chart-neeco2", true);
	setElementVisible(container[0].childNodes, "neeco2-br", true);
    }
    else if( dataflag == "ndvi" ){
	setElementVisible(container[0].childNodes, "ndvichart", true);
	setElementVisible(container[0].childNodes, "chart-ndvi", true);
	InitializeChartNDVI("chart-ndvi", "NDVI Changes", result, dataflag, chartMap);

	var bNDVI = true;
	var owl_ndvi = $("#owl-ndvi");
	owl_ndvi.trigger('destroy.owl.carousel'); 
	InitializeOwlSlideNDVI(owl_ndvi,imgCount, result, bNDVI);
	setElementVisible(container[0].childNodes, "ndviT", true);	
	setElementVisible(container[0].childNodes, "owl-ndvi", true);

	bNDVI = false;
	var owl_evi = $("#owl-evi");
	owl_evi.trigger('destroy.owl.carousel'); 
	InitializeOwlSlideNDVI(owl_evi,imgCount, result, bNDVI);
	
	setElementVisible(container[0].childNodes, "evi", true);
	setElementVisible(container[0].childNodes, "owl-evi", true);
	setElementVisible(container[0].childNodes, "ndvi-br", true);
	jQuery('.owl-carousel').trigger('refresh.owl.carousel');
    }
};

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

// odata - 2017/9/23
var ConvertToDate = function(odata){
    var from = odata.split("/");
    //console.log("date size: " + from.length);
    if(from.length == 3 )
	return new Date(from[2], from[1] - 1, from[0]);
    from = odata.split("-");
    if(from.length == 3 )
	return new Date(from[2], from[1] - 1, from[0]);
    return null;
}


var checkUIStatus = function(uiMap, lng, lat, Ldistance, Lsensor,
			     LimageInterval, Lsttime, Lendtime,
			     surfRef, ndvi, temperature,
			     moisture, precip, neeco2){
    if( uiMap.lng != lng ||  uiMap.lat != lat ){
	uiMap.distance = Ldistance;
	uiMap.sensor = Lsensor;
	uiMap.lng = lng;
	uiMap.lat = lat;
	uiMap.queryType = "sensor";
	return "clall";
    }
    else if( uiMap.distance != Ldistance ||
	     uiMap.sensor != Lsensor){
	uiMap.distance = Ldistance;
	uiMap.sensor = Lsensor;
	uiMap.queryType = "sensor";
	return "appnd";
    }
    else if( uiMap.reflectance != surfRef ){
	uiMap.reflectance = surfRef;
	uiMap.queryType = "reflectance";
	return "appnd";
    }
    else if( uiMap.ndvi != ndvi ){
	uiMap.ndvi = ndvi;
	uiMap.queryType = "ndvi";
	return "appnd";
    }
    else if( uiMap.temperature != temperature ){
	uiMap.temperature = temperature;
	uiMap.queryType = "temperature";
	return "appnd";
    }
    else if( uiMap.moisture != moisture ){
	uiMap.moisture = moisture;
	uiMap.queryType = "moisture";
	return "appnd";
    }
    else if( uiMap.precip != precip ){
	uiMap.precip = precip;
	uiMap.queryType = "precip";
	return "appnd";
    }
    else if( uiMap.neeco2 != neeco2 ){
	uiMap.neeco2 = neeco2;
	uiMap.queryType = "neeco2";
	return "appnd";
    }
    else
	return "error:All handling options not changed"
}


function resetUIMap(uiMap){
    uiMap.longitude = 0.0;
    uiMap.latitude = 0.0;
    uiMap.distance = 0;
    uiMap.sensor  = "";
    uiMap.timeInterval  =  0;
    uiMap.reflectance = false;
    uiMap.ndvi = false;
    uiMap.temperature = false;
    uiMap.moisture = false;
    uiMap.precip = false;
    uiMap.neeco2 = false;  
    uiMap.starttime  =  "";
    uiMap.endtime  = "";
    uiMap.queryType = "";
}

var chartMap = {
    ndvi:null,
    temperature:null,
    precip:null,
    moisture:null,
    neeco2:null
};


function destroyChart(key, chartMap){
    if( key == "ndvi" && chartMap.ndvi != null ){
	chartMap.ndvi.destroy();
	document.getElementById("chart-ndvi").style.display = "none";
	document.getElementById("ndvichart").style.display = "none";
	document.getElementById("ndviT").style.display = "none";
	document.getElementById("ndvi-br").style.display = "none";
    }
    else if( key == "temperature" && chartMap.temperature != null ){
	chartMap.temperature.destroy();
	document.getElementById("chart-temperature").style.display = "none";
	document.getElementById("tempchart").style.display = "none";
	document.getElementById("temperature").style.display = "none";
	document.getElementById("temperature-br").style.display = "none";
    }
    else if( key == "precip" && chartMap.precip != null ){
	chartMap.precip.destroy();
	document.getElementById("chart-precip").style.display = "none";
	document.getElementById("precipchart").style.display = "none";
	document.getElementById("precip-br").style.display = "none";
    }
    else if( key == "moisture" && chartMap.moisture != null ){
	chartMap.moisture.destroy();
	document.getElementById("chart-moisture").style.display = "none";
	document.getElementById("moistchart").style.display = "none";
	document.getElementById("moisture-br").style.display = "none";
    }
    else if( key == "neeco2" && chartMap.neeco2 != null ){
	chartMap.neeco2.destroy();
	document.getElementById("chart-neeco2").style.display = "none";
	document.getElementById("neeco2chart").style.display = "none";
	document.getElementById("neeco2-br").style.display = "none";
    }
}
	
function CleanInterface(chartMap){
    $(document).ready(function(){
	var carousel = $("#owl-ndvi");
	carousel.trigger('destroy.owl.carousel');
	carousel.html("");
	carousel = $("#owl-evi");
	carousel.trigger('destroy.owl.carousel');
	carousel.html("");
	
	document.getElementById("ndviT").style.display = "none";
	document.getElementById("evi").style.display = "none";
	document.getElementById("ndvi-br").style.display = "none";
	
	carousel = $("#owl-temperature");
	carousel.trigger('destroy.owl.carousel');
	carousel.html("");
	document.getElementById("temperature").style.display = "none";
	document.getElementById("temperature-br").style.display = "none";
	
	carousel = $("#owl-reflectance");
	carousel.trigger('destroy.owl.carousel');
	carousel.html("");
	document.getElementById("reflectance").style.display = "none";
	document.getElementById("reflectance-br").style.display = "none";
	
	carousel = $("#owl-demo");
	carousel.trigger('destroy.owl.carousel');
	carousel.html("");
	document.getElementById("landsat8").style.display = "none";
	document.getElementById("landsat8-br").style.display = "none";

	destroyChart("ndvi", chartMap);
	destroyChart("temperature", chartMap);
	destroyChart("precip", chartMap);
	destroyChart("moisture", chartMap);
	destroyChart("neeco2", chartMap);
    });
}
    
var uiMap = {
    lng: 0.0,
    lat: 0.0,
    distance: 0,
    sensor : "",
    timeInterval : 0,
    reflectance:false,
    ndvi:false,
    temperature:false,
    moisture:false,
    precip:false,
    neeco2:false,  
    starttime : "",
    endtime : "",
    queryType: ""
};

// query the server for the given point 
$(document).ready(function(){

    $("#owl-display").owlCarousel({	
        dots: false, //Set AutoPlay to 3 seconds
        items : 5,
	loop:false,
	nav:false,
	//center:true,
	autoWidth:true
    });
    
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
	else{
	    alert("Sensor wrong!");
	    return;
	}

	var Lsttime = $('#dp4').val();
	var Lendtime = $('#dp5').val();
	var start = ConvertToDate(Lsttime);
	var end = ConvertToDate(Lendtime);
	if( end - start <= 0 ){
	    alert("Starting time is after ending time!");
	    return;
	}
	if( start.getFullYear() != end.getFullYear() ){
	    alert("Starting year should be the same as the ending year!");
	    return;
	}

	 
	/* MODIS data starting time and interval time */
	var beginning = "100";
	var timeInterval = "";
	var LimageInterval = $('#imageInterval').val();
	if( imageInterval == 0 )
	    timeInterval = "365";
	else if( LimageInterval == 1 )
	    timeInterval = "7";
	else if( LimageInterval == 2 )
	    timeInterval = "30";
	else if( LimageInterval == 3 )
	    timeInterval = "365";
	else if( LimageInterval == 4 )
	    timeInterval = "8";
	else if( LimageInterval == 5 )
	    timeInterval = "16";
	else
	    timeInterval = "32";

	  
	var surfRef =  $('#surfRef').is(':checked');
	var ndvi = $('#ndvi').is(':checked');
	var evi = ndvi;
	var temperature = $('#surfTemp').is(':checked');
	var moisture = $('#surfMoist').is(':checked');
	var precip =  $('#precip').is(':checked');
	var neeco2 = $('#neeco2').is(':checked');
	var evaptrans = $('#evaptrans').is(':checked');
	var wind =  $('#wind').is(':checked');
	var forcast =  $('#forcat').is(':checked');
	var surfrad = $('#surfRad').is(':checked');
	var soiltype = $('#soilType').is(':checked');
	var dem = $('#dem').is(':checked');
	var drought =  $('#drought').is(':checked');

	var areacover = "";
	var areacode = $('#areaNames').val();
	if( areacode == 0 )
	    areacover = "county";
	else if( areacode == 1 )
	    areacover = "province";
	else if( areacode == 2 )
	    areacover = "country";
	 
	/*
	  Check which data should be picked
	  Every time, only one kind of data is fetched
	  error: no changes
	  appnd: selected one
	  clall: clean all data, goto sensor, normally due to lat/lng changed
	  */
	var status = checkUIStatus(uiMap, lng, lat, Ldistance, Lsensor,
				   LimageInterval, Lsttime, Lendtime,
				   surfRef, ndvi, temperature,
				   moisture, precip, neeco2);
	var otype = status.substr(0,5);
	if( otype == "error" ){
	    alert(status.substr(6));
	    return;
	}
	else if( otype =="clall" ){
	    CleanInterface(chartMap);
	    surfRef = false;
	    ndvi = false;
	    temperature = false;
	    moisture = false;
	    precip = false;
	    neeco2 = false;
	    uiMap.reflectance = surfRef;
	    uiMap.ndvi = ndvi;
	    uiMap.temperature = temperature;
	    uiMap.moisture = moisture;
	    uiMap.precip = precip;
	    uiMap.neeco2 = neeco2;
	}
	else if( otype =="appnd" ){
	    Lsensor = "";
	    surfRef = false;
	    ndvi = false;
	    temperature = false;
	    moisture = false;
	    precip = false;
	    neeco2 = false;
	    
	    var key = uiMap.queryType;
	    if( key == "sensor" ){
		uiMap.sensor = Lsensor;
	    }
	    if( key == "reflectance" ){
		surfRef = true;
		uiMap.reflectance = surfRef;
	    }
	    else if( key == "ndvi" ){
		ndvi = true;
		uiMap.ndvi = ndvi;
	    }
	    else if( key == "temperature" ){
		temperature = true;
		uiMap.temperature = temperature;
	    }
	    else if( key == "moisture" ){
		moisture = true;
		uiMap.moisture = moisture;
	    }
	    else if( key == "precip" ){
		precip = true;
		uiMap.precip = precip;
	    }
	    else if( key == "neeco2" ){
		neeco2 = true;
		uiMap.neeco2 = neeco2;
	    }
	}
	   
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
	    beginning : beginning,
	    timeInterval : timeInterval,
	    reflectance:surfRef,
	    ndvi:ndvi,
	    temperature:temperature,
	    moisture:moisture,
	    radiation:surfrad,
	    evap:evaptrans,
	    soiltype:soiltype,
	    dem:dem,
	    precip:precip,
	    neeco2:neeco2,
	    wind:wind,
	    drought:drought,
	    forcast:forcast,

	    areacover:areacover,
	    
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
				
			if( result.error == "None" ){
			    if( result.l8image != null ){
				/*
				var owl = $( '#owl-demo' );
				owl.owlCarousel({
					 navigation : true
					    });*/
				setOwlSlideshow( result.l8image, "l8image" );
			    }
		        
			    if( result.reflectance != null ) {
				/*
				  if( owlreflectance == false ){
				      console.log("In REFLECTANCE: ");
				      $( '#owl-reflectance' ).owlCarousel({
					      navigation : true,
						  title:"Reflectance:"
						  });
				      owlreflectance = true;
				  }
*/
				  setOwlSlideshow(result.reflectance, "reflectance" );
			    }
			    if( result.ndvi != null ) {
				/*
				  if( owlndvi == false ){
				      console.log("In NDVI: ");
				      $( '#owl-ndvi' ).owlCarousel({
					      navigation : true,
						  title:"NDVI:"
						  });
				      owlndvi = true;
				  }
*/
				  setOwlSlideshow(result.ndvi, "ndvi" );
			    }

			    if( result.temperature != null ) 
				setOwlSlideshow(result.temperature, "temperature" );

			    if( result.precip != null ) {
				console.log("In Precip: ");
				setOwlSlideshow(result.precip, "precip" );
			    }
			    if( result.moisture != null ) {
				console.log("In Moisture: ");
				setOwlSlideshow(result.moisture, "moisture" );
			    }
			    if( result.neeco2 != null ) {
				console.log("In NEE-CO2: ");
				setOwlSlideshow(result.neeco2, "neeco2" );
			    }
			}
			else {
			    alert( result.error );
			    }	
			
			//do somthing here
		    }
		});
	     		       
    });
});
