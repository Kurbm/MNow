  var map, places, infoWindow;
      var markers = [];
      var autocomplete;
      var hostnameRegexp = new RegExp('^https?://.+?/');

     
     function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
 			  center: {lat: 52.521918, lng: 13.413215},
   		  zoom: 11,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          streetViewControl: false
        });
		  
		  var map1 = new google.maps.Map(document.getElementById('map-streetmarket'), {
          center: {lat: 52.521918, lng: 13.413215},
   		  zoom: 11,
		  mapTypeControl: false,
        });
		 
		var map3 = new google.maps.Map(document.getElementById('map-tripduration'), {
        	mapTypeControl: false,
   		center: {lat: 52.521918, lng: 13.413215},
   		zoom: 13
  		});

        setMarkers(map1);
		new AutocompleteDirectionsHandler(map3)
        
        var berlinBounds = new google.maps.LatLngBounds(
   		new google.maps.LatLng(52.36564718258499, 13.025376371663128),
   		new google.maps.LatLng(52.673826366896414, 13.784531628336822));

        infoWindow = new google.maps.InfoWindow({
          content: document.getElementById('info-content')
        });

        autocomplete = new google.maps.places.Autocomplete( 
           (
               document.getElementById('pac-input')), {
 							  bounds: berlinBounds,
  							strictBounds: true,
  			});
        places = new google.maps.places.PlacesService(map);

        autocomplete.addListener('place_changed', onPlaceChanged);
		 
		 document.getElementById('searchType').addEventListener(
            'change', onTypeChanged);
      }
	  
	  var beaches = [
               	['Flohmarkt Mauerpark', 52.5413783, 13.4022105, '1'],
        			['Flohmarkt Arkonaplatz', 52.5379007, 13.4024087, '2'],
		        ['Antik- und Buchmarkt am Bode-Museum / Flohmarkt Museumsinsel', 52.5216541, 13.3949991, '3'],
		        ['Flohmarkt Boxhagener Platz', 52.5106373,13.4591176,'4'],
		        ['Nowkoelln Flowmarkt', 52.4955965, 13.4203641,'5'],
				['Flohmarkt Rathaus Schöneberg', 52.4846564,13.3416523, '6'],
				['Trödelmarkt Marheinekeplatz', 52.4891885,13.3935726, '7'],
				['Nachtmarkt auf der Zitadelle', 52.5409971,13.2105828, '8'],
				['Trödelmarkt und Kunst- & Kunsthanderwerkermarkt Straße des 17. Juni', 52.5135881,13.3311986, '9'],
				['RAW-Flohmarkt', 52.5073437,13.4529905, '10']
	];
	  function AutocompleteDirectionsHandler(map3) {
  this.map3 = map3;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map3);
  
var berlinBoundsDirections = new google.maps.LatLngBounds(
   new google.maps.LatLng(52.36564718258499, 13.025376371663128),
   new google.maps.LatLng(52.673826366896414, 13.784531628336822));


  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');

  var originAutocomplete = new google.maps.places.Autocomplete(originInput, {
  bounds: berlinBoundsDirections,
  strictBounds: true,
  });

  originAutocomplete.setFields(['place_id']);

  var destinationAutocomplete =
      new google.maps.places.Autocomplete(destinationInput, {
  bounds: berlinBoundsDirections,
  strictBounds: true,
  });
  
  destinationAutocomplete.setFields(['place_id']);

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}


AutocompleteDirectionsHandler.prototype.setupClickListener = function(
    id, mode) {
  var radioButton = document.getElementById(id);
  var me = this;

  radioButton.addEventListener('click', function() {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
    autocomplete, mode) {
  var me = this;

  autocomplete.addListener('place_changed', function() {
    var placeDirection = autocomplete.getPlace();

    if (!placeDirection.place_id) {
      window.alert('Please select an option from the dropdown list.');
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = placeDirection.place_id;
    } else {
      me.destinationPlaceId = placeDirection.place_id;
    }
    me.route();
  });
}; 
AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;
  this.directionsService.route(
      {
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      },
      function(response, status) {
        if (status === 'OK') {
          me.directionsDisplay.setDirections(response);
          var point = response.routes[ 0 ].legs[ 0 ];
        
       $( '#travel_data' ).html( 'Ungefähre Fahrzeit: ' + point.duration.text + ' (' + point.distance.text + ')' );
       $('#map-tripduration').show();
       $('#travel_data').show();
       $('#map-tripduration').css("height","400px");

        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
};

	   function setMarkers(map1) {
        var image1 = {
              
          url: 'https://app.movinganow.com/baseline-location-on-24-px-copy-3.d1e5627c.svg',
            origin: new google.maps.Point(0, 0),
          labelOrigin: new google.maps.Point(14,14)
         };
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        for (var i = 0; i < beaches.length; i++) {
          var beach = beaches[i];
          var marker = new google.maps.Marker({
            position: {lat: beach[1], lng: beach[2]},
            map: map1,
            icon: image1,
            label: {
            text: beach[3],
            shape: shape,
            title: beach[0],
            color: 'black',
            fontWeight: 'bold'}
          });
        }
      }
      function onPlaceChanged() {
     
	 var place = autocomplete.getPlace();
	      if (typeof place !== 'undefined') {
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
          search();
	  return place
        } else {
          document.getElementById('pac-input').placeholder = 'Straßenname';
        }}
       
      }
	  
	   function onTypeChanged() {
		   if( document.getElementById('pac-input').value !== "") {console.log("empty")
		   }
		var place = onPlaceChanged()   
		 //  console.log(type)
        
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
          search();
        } else {
          document.getElementById('pac-input').placeholder = 'Straßenname';
        }
      }
      function search() {
        var slug_maps = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
	var type = document.getElementById('searchType').value;
	if (slug_maps === 'moebelhaus') {
		  var search = {
          bounds: map.getBounds(),
          types: ['furniture_store']
        };
	} else if (slug_maps === 'moebeltaxi') {
		  var search = {
          bounds: map.getBounds(),
	  types: [type]
        };
	} 
       
        places.nearbySearch(search, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            for (var i = 0; i < results.length; i++) {
                  var markerIcon = 'https://app.movinganow.com/baseline-location-on-24-px-copy-3.d1e5627c.svg';
                markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                title: results[i].name,
                 icon: markerIcon        
              });
              markers[i].placeResult = results[i];
              google.maps.event.addListener(markers[i], 'click', showInfoWindow);
          		    setTimeout(dropMarker(i), 100);
            }
          }
        });
      }
      function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          if (markers[i]) {
            markers[i].setMap(null);
          }
        }
        markers = [];
      }

     

      function dropMarker(i) {
        return function() {
          markers[i].setMap(map);
        };
      }




      function showInfoWindow() {
        var marker = this;
        places.getDetails({placeId: marker.placeResult.place_id},
            function(place, status) {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
              }
              infoWindow.open(map, marker);
              buildIWContent(place);
            });
      }

      function buildIWContent(place) {
        document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
            '">' + place.name + '</a></b>';
        document.getElementById('iw-address').textContent = place.vicinity;

        if (place.formatted_phone_number) {
          document.getElementById('iw-phone-row').style.display = '';
          document.getElementById('iw-phone').textContent =
              place.formatted_phone_number;
        } else {
          document.getElementById('iw-phone-row').style.display = 'none';
        }

        if (place.rating) {
          var ratingHtml = '';
          for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
              ratingHtml += '&#10025;';
            } else {
              ratingHtml += '&#10029;';
            }
          document.getElementById('iw-rating-row').style.display = '';
          document.getElementById('iw-rating').innerHTML = ratingHtml;
          }
        } else {
          document.getElementById('iw-rating-row').style.display = 'none';
        }
        if (place.website) {
          var fullUrl = place.website;
          var website = hostnameRegexp.exec(place.website);
          if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
          }
          document.getElementById('iw-website-row').style.display = '';
          document.getElementById('iw-website').textContent = website;
        } else {
          document.getElementById('iw-website-row').style.display = 'none';
        }
      }      
