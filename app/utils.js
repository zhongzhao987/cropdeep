var geolib = require('geolib');

module.exports = {
    pointToLine:function(x, y, x1, y1, x2, y2) {

	var A = x - x1;
	var B = y - y1;
	var C = x2 - x1;
	var D = y2 - y1;

	var dot = A * C + B * D;
	var len_sq = C * C + D * D;
	var param = -1;
	if (len_sq != 0) //in case of 0 length line
	    param = dot / len_sq;

	var xx, yy;

	if (param < 0) {
	    xx = x1;
	    yy = y1;
	}
	else if (param > 1) {
	    xx = x2;
	    yy = y2;
	}
	else {
	    xx = x1 + param * C;
	    yy = y1 + param * D;
	}

	var dx = x - xx;
	var dy = y - yy;
	return Math.sqrt(dx * dx + dy * dy);
    },

    PointInPolygon : function(point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
	var x = point[0], y = point[1];
    
	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
	    var xi = vs[i][0], yi = vs[i][1];
	    var xj = vs[j][0], yj = vs[j][1];
        
	    var intersect = ((yi > y) != (yj > y))
		&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
	    if (intersect) inside = !inside;
	}
    
	return inside;
    }
};

