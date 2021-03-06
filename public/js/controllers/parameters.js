angular.module('posController', [])
// inject the Todo service factory into our controller
    .controller('positionController', ['$scope',  function($scope) {
		$scope.CurrLat = "0.0";
		$scope.CurrLong = "0.0";
		$scope.distanceNames = ["2.5 km", "5.0 km", "10.0 km"];
		$scope.areaNames = ["County", "Province", "Country"];
		$scope.sensorNames = ["L8", "Sentinel 1", "Sentinel 2"];
		$scope.modisNames = ["Atm correction", "NDVI"];
		$scope.meteroNames = ["Percipation", "Temperature"];
		$scope.cloudNames = ["< 5%", "< 10%", "< 15%", "< 20%"];
		$scope.startTime = 'DD/MM/YYYY';
		$scope.endTime = 'DD/MM/YYYY';
		$scope.imageNames = ["Current Year", "Week", "Month", "Year", "8 Days", "16 Days", "32 days"];
		$scope.weatherNames = ["Last Week", "Last Month", "Week", "Month", "Year"];

		$scope.ChangeLong = function( longVal){
		    $scope.CurrLong = longVal;
		}
		$scope.ChangeLat = function( latVal){
		    $scope.CurrLat = latVal;
		}   
	
		/*
		$scope.SelectParams = function() {
		    lat = Number($scope.CurrLat);
		    if( lat > 90.0 || lat < -90.0 )
			alert("Latitude is out of range!");
		    lng = Number($scope.CurrLong);
		    if( lng > 180.0 || lng < -180.0 )
			alert("Longitude is out of range!");
		    if( $scope.distanceName != "2.5 km" ||
			$scope.distanceName != "5.0 km" ||
			$scope.distanceName != "10.0 km" )
			alert("Distance is out of range!");
		    if( $scope.sensorName != "L8" ||
			$scope.sensorName != "Sentinel 1" ||
			$scope.sensorName != "Sentinel 2" )
			alert("Sensor is out of range!");
		    if( $scope.cloudName != "< 5%" ||
			$scope.cloudName != "< 10%" ||
			$scope.cloudName != "< 15%" ||
			$scope.cloudName != "< 20%" )
			alert("Sensor is out of range!");

		    var sttime = $('#startTime').val();
		    var endtime = $('#endTime').val();

		    alert(sttime);

		    Date stD = new Date(sttime);
		    Date endD = new Date(endtime);
		    if( stD >= endD )
			alert("Start Time is later than End time!");
		}
		*/
		
	}]);
