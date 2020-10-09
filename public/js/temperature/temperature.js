
//https://www.w3schools.com/howto/howto_js_slideshow.asp

var tempSlideIndex = 1;

module.exports = {
    tempSlides:function(n) {
	showTempSlides(tempSlideIndex += n);
    },

    currentTempSlide:function(n) {
	showTempSlides(tempSlideIndex = n);
    },
    
    addTempImages:function( index, total, data, time, slide){
	$('<div class="tempSlides fade"><div class="tempnumbertext">'+index+' / '+total+'</div><img src="data:image/bmp;base64",'+data+' style="width:128"><div class="text">'+time+'</div></div>').appendTo(slide);
    },

    addTempSlideArrays:function(slide){
	$('<a class="tempslideprev" onclick="tempSlides(-1)">&#10096;</a><a class="tempslidenext" onclick="tempSlides(1)">&#10097;</a>').appendTo(slide);
    },

    addTempSlideDots:function(i, slidedot){
	var name = "currentTempSlide("+i+")";
	$('<span class="dot" onclick='+name+'></span>').appendTo(slidedot);
    },

    displayTempSlide:function(){
	$('.tempslideshow-container').style.display = 'block';
	$('.tempslideshow-container').style.visibility = 'visible';
    },

    hideTempSlide:function(){
	$('.tempslideshow-container').style.display = 'none';
	$('.tempslideshow-container').style.visibility = 'none';
    },

    setTempSlideshow:function(result) {

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
    
    var slides = document.getElementsByClassName("tempslideshow-container");
    for( i = 0; i < imgCount; i++ )
	addImages( i+1, imgCount, result.data[i].img, result.data[i].time, slides);

    //var imgs = $('.mySlides');
    addTempSlideArrays(slides);
  
    var dots = document.getElementsByClassName("dots");
    for( i = 1; i <= imgCount; i++ ){
	addTempSlideDots(i, dots);
    }
    //dots.appendTo(slides);
    
    displayTempSlide();

    
    },

    showTempSlides:function(n){
    var i;
    var slides = document.getElementsByClassName("tempSlides");
    var dots = document.getElementsByClassName("tempslideshow-dot");
    if (n > slides.length) {tempSlideIndex = 1}
    if (n < 1) {tempSlideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
	slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
	dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[tempSlideIndex-1].style.display = "block";
    dots[tempSlideIndex-1].className += " active";
    
} 
}