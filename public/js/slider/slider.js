
//https://www.w3schools.com/howto/howto_js_slideshow.asp

var slideIndex = 1;

module.exports = {
    plusSlides:function(n) {
	showSlides(slideIndex += n);
    },

    currentSlide:function(n) {
	showSlides(slideIndex = n);
    },
    
    addImages:function( index, total, data, time, slide){
	$('<div class="mySlides fade"><div class="numbertext">'+index+' / '+total+'</div><img src="data:image/bmp;base64",'+data+' style="width:512"><div class="text">'+time+'</div></div>').appendTo(slide);
    },

    addSlideArrays:function(slide){
	$('<a class="slideprev" onclick="plusSlides(-1)">&#10094;</a><a class="slidenext" onclick="plusSlides(1)">&#10095;</a>').appendTo(slide);
    },

    addSlideDots:function(i, slidedot){
	var name = "currentSlide("+i+")";
	$('<span class="dot" onclick='+name+'></span>').appendTo(slidedot);
    },

    displaySlide:function(){
	$('.slideshow-container').style.display = 'block';
	$('.slideshow-container').style.visibility = 'visible';
    },

    hideSlide:function(){
	$('.slideshow-container').style.display = 'none';
	$('.slideshow-container').style.visibility = 'none';
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
    for( i = 0; i < imgCount; i++ )
	addImages( i+1, imgCount, result.data[i].img, result.data[i].time, slides);

    //var imgs = $('.mySlides');
    addSlideArrays(slides);
  
    var dots = document.getElementsByClassName("dots");
    for( i = 1; i <= imgCount; i++ ){
	addSlideDots(i, dots);
    }
    //dots.appendTo(slides);
    
    displaySlide();

    
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
    dots[slideIndex-1].className += " active";
    
} 
}