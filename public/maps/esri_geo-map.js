// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

var map = L.map( 'map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 2
})

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo( map )

var myURL = jQuery( 'script[src$="geo-map.js"]' ).attr( 'src' ).replace( 'geo-map.js', '' )

var myIcon = L.icon({
  iconUrl: myURL + 'images/pin24.png',
  iconRetinaUrl: myURL + 'images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
})

    /*
for ( var i=0; i < markers.length; ++i )
{
 L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon} )
  .bindPopup( '<a href="' + markers[i].url + '" target="_blank">' + markers[i].name + '</a>' )
  .addTo( map );
}
    */

// initial click flag
var myMapClickMark = false;

// dynamically update map positions
map.on('mousemove', function (e) {
	if(myMapClickMark === false){
	    var lat1 = document.getElementById("latitude");
	    lat1.value = e.latlng.lat;
	    var long1 = document.getElementById("longitude");
	    long1.value = e.latlng.lng;
	}
});

var marker;
map.on('click', function (e) {
	// set marker position
	if(myMapClickMark === false){
	    // add a new marker to map since it is the first time
	    var lat1 = document.getElementById("latitude");
	    lat1.value = e.latlng.lat;
	    var long1 = document.getElementById("longitude");
	    long1.value = e.latlng.lng;
	    marker = L.marker([lat1.value, long1.value]).addTo(map);
	    myMapClickMark = true;
	} else {    
	    // move the marker based on the new mouse position
	    var lat1 = document.getElementById("latitude");
	    lat1.value = e.latlng.lat;
	    var long1 = document.getElementById("longitude");
	    long1.value = e.latlng.lng;
	    marker.setLatLng(e.latlng); 
	}
});

map.on('dblclick', function (e) {
	// remove marker so mousemove can be catched to dynamiclly 
	// update position
	if(myMapClickMark === true){
	    map.removeLayer(marker);
	    myMapClickMark = false;
	}
});
