//map functions for Google Maps API V3 by Ben Beckford

/*Generate map styles at: http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html

Example usage:

<script type="text/javascript" src="scripts/jquery.js"></script>
<script type="text/javascript" src="scripts/maps_functions_v3.js"></script>
<script type="text/javascript" src="http://maps.google.co.uk/maps/api/js?sensor=false&amp;key=ABQIAAAAQmgxb2K8HFvl_SKRZsLfwRSJx3J6llU8viU-jAWyZd7L5UlWBhRjtI42uk8PU0rAR9wp-UWRpqQSYQ"></script>

<script type="text/javascript">
$(document).ready(function(){
	createMap({xmlPath: "storage/xml/locations.xml",
			  containerID: "map",
			  mouseWheel: true,
			  zoom: 12,
			  forceCenterLng: 51.5055,
			  forceCenterLat: -0.0738,
			  allControlsOn: false,
			  navigationControl: true,
			  mapTypeControl: true,
			  scaleControl: true,
			  fullscreenControl: false,
			  streetViewControl: true,
			  mapStyle: [ { featureType: "all", elementType: "all", stylers: [ { hue: "#ff0044" } ] } ]
	});

});
</script>

<div style="width: 650px; height: 600px" id="map"></div>

*/

var Map, GMap, $Container, directionsService, directionsDisplay, geocoder, latlngbounds, markersArray, locationArray;
var allControlsOn = false;
var gmStartID = 0;

var locationMarker, geocodeTimeout;
var markerImage = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4FB8F1|06418B";
var cp_mapZoom = 9;
var geocodeComplete = true;


function locationObject(){
	this.long = 0;
	this.lat = 0;
	this.title = "";
	this.address = "";
	this.link = "";
}

function createMap(params)
{

	if(params.pointArray != null)
	{
		setupMap(params);
	}
	else
	{
		params.pointArray = new Array();

		$.ajax({
			type: "GET",
			url: encodeURI(params.xmlPath),
			dataType: "xml",
			success: function(xml) {
				$(xml).find('xml').each(function(){


					$(this).find('location').each(function(){

						var long = $(this).attr("longitude");
						var lat = $(this).attr("latitude");
						var title = $(this).attr("title");
						var balloonContent = $(this).attr("balloonContent");

						var markerImage = "";

						if($(this).attr("icon") != null)
						{
							markerImage = $(this).attr("icon");
						}

						params.pointArray.push({long: long, lat: lat, title: title, balloonContent: balloonContent, markerImage: markerImage});

					});

				});

				setupMap(params);

			}
		});
	}

}

var setupMap = function(params) {

	google.maps.visualRefresh = true;

	var markersArray = new Array();
	locationArray = new Array();
	var iconArray = new Array();

	var i = 0;
	for(i = 0; i < params.pointArray.length; i++)
	{
		var location = new locationObject();
		location.long = params.pointArray[i].long;
		location.lat = params.pointArray[i].lat;
		location.title = params.pointArray[i].title;
		if(location.title == null)
		{
			location.title = "";
		}

		location.balloonContent = params.pointArray[i].balloonContent;
		if(location.balloonContent == null)
		{
			location.balloonContent = "";
		}

		locationArray.push(location);

		var markerImage = "";

		if(params.pointArray[i].markerImage != null && params.pointArray[i].markerImage != "")
		{
			markerImage = params.pointArray[i].markerImage;
		}

		iconArray.push(markerImage);
	}

	geocoder = new google.maps.Geocoder();

	if(params.allControlsOn != null)
	{
		allControlsOn = params.allControlsOn;
	}

	var startPoint = new google.maps.LatLng(-0.1262295, 51.5001973);

	var Options = {
		center: startPoint,
		zoom: 10,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: allControlsOn,
		mapTypeControlOptions: {},
		scaleControl: allControlsOn,
		fullscreenControl: allControlsOn,
		disableDefaultUI: false,
		scaleControlOptions: {},
		streetViewControl: allControlsOn,
		streetViewControlOptions: {},
		overviewMapControl: allControlsOn,
		overviewMapControlOptions: {},
		panControl: allControlsOn,
		panControlOptions: {},
		zoomControl: allControlsOn,
		zoomControlOptions: {},
		disableDoubleClickZoom: false
	}

	if(params.zoom != null)
	{
		Options.zoom = params.zoom;
	}
	if(params.mapTypeControl != null)
	{
		Options.mapTypeControl = params.mapTypeControl;
	}
	if(params.scaleControl != null)
	{
		Options.scaleControl = params.scaleControl;
	}
	if(params.fullscreenControl != null)
	{
		Options.fullscreenControl = params.fullscreenControl;
	}
	if(params.disableDefaultUI != null)
	{
		Options.disableDefaultUI = params.disableDefaultUI;
	}
	if(params.streetViewControl != null)
	{
		Options.streetViewControl = params.streetViewControl;
	}
	if(params.overviewMapControl != null)
	{
		Options.overviewMapControl = params.overviewMapControl;
	}
	if(params.navigationControl != null)
	{
		Options.panControl = params.navigationControl;
		Options.zoomControl = params.navigationControl;
	}
	else
	{
		if(params.panControl != null)
		{
			Options.panControl = params.panControl;
		}
		if(params.zoomControl != null)
		{
			Options.zoomControl = params.zoomControl;
		}
	}
	if(params.disableDoubleClickZoom != null)
	{
		Options.disableDoubleClickZoom = params.disableDoubleClickZoom;
	}

	if(params.mapStyle != null)
	{
		Options.mapTypeControlOptions = { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'customMapStyle'] };
	}
	else if(params.mapType != null)
	{
		switch(params.mapType)
		{
			case "satellite":
				Options.mapTypeId = google.maps.MapTypeId.SATELLITE;
				break;
			case "hybrid":
				Options.mapTypeId = google.maps.MapTypeId.HYBRID;
				break;
			case "terrain":
				Options.mapTypeId = google.maps.MapTypeId.TERRAIN;
				break;
		}
	}

	if(params.mapTypeControlPosition != null)
	{
		Options.mapTypeControlOptions.position = getControlPosition(params.mapTypeControlPosition);
	}

	if(params.navigationControlPosition != null)
	{
		Options.navigationControlOptions.position = getControlPosition(params.navigationControlPosition);
	}

	if(params.scaleControlPosition != null)
	{
		Options.scaleControlOptions.position = getControlPosition(params.scaleControlPosition);
	}

	if(params.streetViewControlPosition != null)
	{
		Options.streetViewControlOptions.position = getControlPosition(params.streetViewControlPosition);
	}

	if(params.mouseWheel == false)
	{
		Options.scrollwheel = false;
	}

	if(params.$elm == null)
	{
		params.$elm = $('#'+params.containerID)[0];
	}
	else if(params.$elm.length > 0)
	{
		params.$elm = params.$elm[0];
	}

	if(params.touchControls === false && is_touch_device())
	{
		Options.draggable = false;

		params.$elm.addEventListener("touchstart", thisTouchStart, true);
		params.$elm.addEventListener("touchend", thisTouchEnd, true);
		params.$elm.addEventListener("touchmove", thisTouchMove, true);
	}

	GMap = new google.maps.Map(params.$elm, Options);
	if (Map == null) {
		Map = GMap;
	}
	var infowindow = new google.maps.InfoWindow();

	var start = 0, end = 0;

	function thisTouchStart(e)
	{
	    dragFlag = true;
	    start = e.touches[0].pageY;
	}

	function thisTouchEnd()
	{
	    dragFlag = false;
	}

	function thisTouchMove(e)
	{
	    if ( !dragFlag ) return;
	    end = e.touches[0].pageY;
	    window.scrollBy( 0,( start - end ) );
	}

	function is_touch_device() {
	  return !!('ontouchstart' in window);
	}

	/*
	if(params.markerImage != null)
	{
		var markerImage = params.markerImage;

		if(params.markerCenterX != null && params.markerCenterY != null && params.markerWidth != null && params.markerHeight != null)
		{
			var imagePath = markerImage;
			markerImage = new google.maps.MarkerImage(
				imagePath,
				// This marker width/height
				new google.maps.Size(params.markerWidth, params.markerHeight),
				// The marker top left origin (used for sprite images)
				new google.maps.Point(0,0),
				// The anchor for this image is the base of the flagpole at 0,32.
				new google.maps.Point(params.markerCenterX, params.markerCenterY)
			);

		}

		addMarker(GMap, startPoint, markerImage, "", false);
	}
	*/

	if(params.mapStyle != null)
	{
		var styledMapOptions = {
			name: "customMapStyle"
		}

		var customMapType = new google.maps.StyledMapType(params.mapStyle, styledMapOptions);

		GMap.mapTypes.set('customMapStyle', customMapType);
		GMap.setMapTypeId('customMapStyle');
	}

	latlngbounds = new google.maps.LatLngBounds();

	for (var i = 0; i < locationArray.length; i++)
	{
		var newPoint = new google.maps.LatLng(locationArray[i].long, locationArray[i].lat);

		var marker = addMarker(GMap, {Point: newPoint, Icon: iconArray[i]});

		if(i == 0)
		{
			gmStartID = marker.__gm_id;
		}

        locationArray[i].gmid = marker.__gm_id;
        marker.locationArrayId = i;

		//var newTitle = locationArray[i].title;
		// var newBalloonContent = locationArray[i].balloonContent;

		if(locationArray[i].balloonContent != "")
		{
			google.maps.event.addListener(marker, 'click', function(e) {
				//infowindow.setTitle(locationArray[this.__gm_id - gmStartID].title);

				//infowindow.setContent(locationArray[this.__gm_id - gmStartID].balloonContent);
	        	infowindow.setContent(locationArray[this.locationArrayId].balloonContent);
				infowindow.open(GMap, this);
			});
		}

		markersArray.push(marker);

		latlngbounds.extend(newPoint);
	}

	if(params.onStartOpenBubble != null)
	{
		google.maps.event.addListenerOnce(GMap, 'idle', function(){

		    infowindow.setContent(locationArray[params.onStartOpenBubble-1].balloonContent);
			infowindow.open(GMap, markersArray[params.onStartOpenBubble-1]);
		});
	}

	if(params.forceCenterLat != null && params.forceCenterLng != null)
	{
		var newPoint = new google.maps.LatLng(params.forceCenterLng, params.forceCenterLat);
		GMap.setCenter( newPoint );
	}
	else if(params.onStartOpenBubble == null)
	{
		if(params.zoom == null)
		{
			var sw = latlngbounds.getSouthWest();
			var ne = latlngbounds.getNorthEast();
			var GLOBE_WIDTH = 256; // a constant in Google's map projection
			var west = sw.lng();
			var east = ne.lng();
			var angle = east - west;
			if (angle < 0) {
			  angle += 360;
			}

			var newZoom = Math.round(Math.log(params.$elm.width() * 360 / angle / GLOBE_WIDTH) / Math.LN2) - 2;

			GMap.setZoom( newZoom );
		}
		GMap.setCenter( latlngbounds.getCenter() );
	}



	if (typeof params.callbackFunc == 'function') {
	  params.callbackFunc(markersArray);
	}

	return(GMap);


}

var getControlPosition = function(positionString) {

	switch(positionString)
	{
		case "TOP_CENTER": //indicates that the control should be placed along the top center of the map.
			return(google.maps.ControlPosition.TOP_CENTER);
			break;
		case "TOP_LEFT": //indicates that the control should be placed along the top left of the map, with any sub-elements of the control "flowing" towards the top center
			return(google.maps.ControlPosition.TOP_LEFT);
			break;
		case "TOP_RIGHT": //indicates that the control should be placed along the top right of the map, with any sub-elements of the control "flowing" towards the top center
			return(google.maps.ControlPosition.TOP_RIGHT);
			break;
		case "LEFT_TOP": //indicates that the control should be placed along the top left of the map, but below any TOP_LEFT elements
			return(google.maps.ControlPosition.LEFT_TOP);
			break;
		case "RIGHT_TOP": //indicates that the control should be placed along the top right of the map, but below any TOP_RIGHT elements
			return(google.maps.ControlPosition.RIGHT_TOP);
			break;
		case "LEFT_CENTER": //indicates that the control should be placed along the left side of the map, centered between the TOP_LEFT and BOTTOM_LEFT positions
			return(google.maps.ControlPosition.LEFT_CENTER);
			break;
		case "RIGHT_CENTER": //indicates that the control should be placed along the right side of the map, centered between the TOP_RIGHT and BOTTOM_RIGHT positions
			return(google.maps.ControlPosition.RIGHT_CENTER);
			break;
		case "LEFT_BOTTOM": //indicates that the control should be placed along the bottom left of the map, but above any BOTTOM_LEFT elements
			return(google.maps.ControlPosition.TOP_CENTER);
			break;
		case "RIGHT_BOTTOM": //indicates that the control should be placed along the bottom right of the map, but above any BOTTOM_RIGHT elements
			return(google.maps.ControlPosition.TOP_CENTER);
			break;
		case "BOTTOM_CENTER": //indicates that the control should be placed along the bottom center of the map
			return(google.maps.ControlPosition.BOTTOM_CENTER);
			break;
		case "BOTTOM_LEFT": //indicates that the control should be placed along the bottom left of the map, with any sub-elements of the control "flowing" towards the bottom center
			return(google.maps.ControlPosition.BOTTOM_LEFT);
			break;
		case "BOTTOM_RIGHT": //indicates that the control should be placed along the bottom right of the map, with any sub-elements of the control "flowing" towards the bottom center
			return(google.maps.ControlPosition.BOTTOM_RIGHT);
			break;
		default:
			return(null);
			break;
	}
}

var getDistance = function(params)
{
	var A = params.pointA;
	var B = params.pointB;

	directionsService = new google.maps.DirectionsService();

	var request = {
		origin:A,
		destination:B,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {

			var distance = response.routes[0].legs[0].distance.value;
			var timeSeconds = response.routes[0].legs[0].duration.value;
			var timeFormatted = response.routes[0].legs[0].duration.text;

			var distanceKilometres = parseFloat(distance / 1000);
			var distanceMiles = format2Dec(distanceKilometres * 0.621371192);
			distanceKilometres = format2Dec(distanceKilometres);

			var returner = {distanceKilometres: distanceKilometres, distanceMiles: distanceMiles, timeSeconds: timeSeconds, timeFormatted: timeFormatted, pointA: A, pointB: B};
			params.callback(returner);
		}
		else
		{
			if(status == "ZERO_RESULTS")
			{
				params.callback(false);
			}
		}
	});
}

var removeMarker = function(marker)
{
	if(marker != undefined)
	{
		marker.setMap(null);
	}
}

var addMarker = function(MapObj, params)
{
	if(params.CenterMap == null)
	{
		params.CenterMap = true;
	}

	var markerSettings = new Object;
	markerSettings.map = MapObj;
	markerSettings.position = params.Point;

	if(params.Icon != null)
	{
		if(Modernizr.Detectizr.browser.name == "ie")
		{
			var image = {
				url: params.Icon,
				scaledSize: new google.maps.Size(50, 50)
			}
		}
		else
		{
			var image = params.Icon
		}

		markerSettings.icon = image;
	}
	if(params.Title != null)
	{
		markerSettings.title = params.Title;
	}

	var newMarker = new google.maps.Marker(markerSettings);

	if(params.InfoWindow != null && params.InfoWindow != "")
	{
		var infowindow = new google.maps.InfoWindow({
			content: params.InfoWindow
		});

		google.maps.event.addListener(newMarker, 'click', function() {
		  infowindow.open(MapObj, newMarker);
		});
	}

	if(params.CenterMap == true)
	{
		MapObj.setCenter(params.Point);
	}

	return(newMarker);
}

var checkValidUKPoint = function(A, B)
{
	var A = {
	origin:location1,
	destination: "6 Baker Street, Paddington, Greater London",
	travelMode: google.maps.DirectionsTravelMode.DRIVING
	};

	directionsService.route(request1, function(response, status) {
		if(status == "ZERO_RESULTS")
		{
			//no route found
		}
	});

	var request2 = {
	origin: B,
	destination: "6 Baker Street, Paddington, Greater London",
	travelMode: google.maps.DirectionsTravelMode.DRIVING
	};

	directionsService.route(request2, function(response, status) {
		if(status == "ZERO_RESULTS")
		{
			//no route found
		}
	});
}

var format2Dec = function(num)
{
	num *= 100;
	num = parseInt(num);
	num /= 100;
	return num;
}


function codeAddress(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
		alert(results[0].geometry.location);
	  } else {
		alert("Geocode was not successful for the following reason: " + status);
	  }
	});
}

/*Map resize
google.maps.event.trigger(startPointMap, 'resize');
*/

/*Zoom Map
Map.setZoom(12);
*/

/*Center Map
Map.setCenter(point);
*/

/*Directions
 	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
*/

/*Draggable Marker
	var newMarker = new google.maps.Marker({
		position: Point,
		map: Map,
		title: Title,
		draggable: Draggable,
		icon: "storage/images/maps_marker_a.png"
	});

	google.maps.event.addListener(startMarker, 'dragend', function() {
		newStartPoint = startMarker.getPosition();
		mapDragUpdate();
	});
*/



//Control Panel Location Functions:

var initLocationGMap = function(geocodeCallback) {

	var markerObj = function(long, lat, markerImage) {
	  this.long = long;
	  this.lat = lat;
	  this.markerImage = markerImage;
	}

	var zoom = cp_mapZoom;
	var lat = 51.510;
	var lng = -0.117;

	if($('#locationLat').val() != "")
	{
	  lat = $('#locationLat').val();
	  lng = $('#locationLong').val();
	}

	var markerArray = new Array(new markerObj(lat, lng, markerImage));

	setupMap({containerID: "rc_map_canvas", pointArray: markerArray, allControlsOn: true, mouseWheel: false, zoom: zoom, callbackFunc: function(markersArray)
	  {
	    locationMarker = markersArray[0];
	  }
	});

	$('#rcv_loc_name, #rcl_loc_name, #syu_loc_name, #rca_loc_name').keyup(function(e){

	  if(e.keyCode == 13)
	  {
	    clearTimeout(geocodeTimeout);
	    geocodeAddress(geocodeCallback);
	  }
	  else
	  {
	    clearTimeout(geocodeTimeout);
	    geocodeTimeout = setTimeout(function(){ geocodeAddress(geocodeCallback); }, 1000);
	  }

	}).change(function(){
	    geocodeAddress(geocodeCallback);
	});

}

var setupAddressInputMap = function($textInput, $latInput, $longInput, $mapWrapper, $countryCodeInput)
{
	var markerObj = function(long, lat, markerImage) {
	  this.long = long;
	  this.lat = lat;
	  this.markerImage = markerImage;
	}

	var zoom = cp_mapZoom;
	var lat = 51.510;
	var lng = -0.117;

	if($latInput.val() != "")
	{
	  lat = $latInput.val();
	  lng = $longInput.val();
	}

	var markerArray = new Array(new markerObj(lat, lng, markerImage));

	location_autocomplete_init($textInput);

	var theMarker = null;

	var theMap = setupMap({$elm: $mapWrapper, pointArray: markerArray, allControlsOn: true, mouseWheel: false, zoom: zoom, callbackFunc: function(markersArray)
	  {
	    theMarker = markersArray[0];
	  }
	});

	$textInput.keyup(function(e){

	  if(e.keyCode == 13)
	  {
	    clearTimeout(geocodeTimeout);
	    geocodeInputMapAddress($textInput, $latInput, $longInput, theMarker, theMap, $countryCodeInput);
	  }
	  else
	  {
	    clearTimeout(geocodeTimeout);
	    geocodeTimeout = setTimeout(function(){ geocodeInputMapAddress($textInput, $latInput, $longInput, theMarker, theMap, $countryCodeInput); }, 1000);
	  }

	}).change(function(){
	    geocodeInputMapAddress($textInput, $latInput, $longInput, theMarker, theMap, $countryCodeInput);
	});
}

var get_region_local_geocode_bias = function() {
	if(typeof region_local_geocode_bias != "undefined")
	{
		return(region_local_geocode_bias);
	}
	else
	{
		return("");
	}
}

var geocodeInputMapAddress = function($textInput, $latInput, $longInput, marker, theMap, $countryCodeInput) {
  clearTimeout(geocodeTimeout);
  geocodeComplete = false;

  var address = $textInput.val();

  geocoder.geocode( { 'address': address, 'region': get_region_local_geocode_bias()}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      theMap.setCenter(results[0].geometry.location);
      theMap.setZoom(cp_mapZoom);
      marker.setPosition(results[0].geometry.location);
      $latInput.val(results[0].geometry.location.lat());
      $longInput.val(results[0].geometry.location.lng());

      //strangely, not able to directly grab the country of a looked up address - have to look through the address components of the returned array and find component with a type 'country'. info here https://developers.google.com/maps/documentation/geocoding/intro
      var countryCode = '';
      var address_components = results[0].address_components;
      for(var i in address_components)
      {
		if(address_components[i]["types"].indexOf("country") != -1)
		{
      		countryCode = address_components[i].short_name;
      		break;
		}
      }
      $countryCodeInput.val(countryCode);

      geocodeComplete = true;
      if(typeof geocodeCallback == 'function')
      {
        geocodeCallback();
      }
    } else {
      geocodeComplete = true;
      $latInput.val("");
      $longInput.val("");
      $countryCodeInput.val("");
      //alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}

var geocodeAddress = function(geocodeCallback) {
  clearTimeout(geocodeTimeout);
  geocodeComplete = false;

  var address = "";

  if($('#rcv_loc_name').length > 0)
  {
  	address = $('#rcv_loc_name').val();
  }
  else if($('#rcl_loc_name').length > 0)
  {
  	address = $('#rcl_loc_name').val();
  }
  else if($('#syu_loc_name').length > 0)
  {
  	address = $('#syu_loc_name').val();
  }
  else if($('#rca_loc_name').length > 0)
  {
  	address = $('#rca_loc_name').val();
  }

  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      GMap.setCenter(results[0].geometry.location);
      GMap.setZoom(cp_mapZoom);
      locationMarker.setPosition(results[0].geometry.location);
      $('#locationLat').val(results[0].geometry.location.lat());
      $('#locationLong').val(results[0].geometry.location.lng());
      geocodeComplete = true;
      if(typeof geocodeCallback == 'function')
      {
        geocodeCallback();
      }
    } else {
      geocodeComplete = true;
      $('#locationLat').val("");
      $('#locationLong').val("");
      //alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}