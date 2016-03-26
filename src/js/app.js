var defaultLocations = [
    {'name': 'Jackson Square', 'location': {'coordinate':{'latitude': 29.957466, 'longitude': -90.062972}}, 'marker': ''},
    {'name': 'Woldenberg Park', 'location': {'coordinate':{'latitude': 29.9533, 'longitude': -90.0630}}, 'marker': ''},
    {'name': 'Cafe Du Monde', 'location': {'coordinate':{'latitude': 29.957491, 'longitude': -90.061811}}, 'marker': ''},
    {'name': 'House of Blues', 'location': {'coordinate':{'latitude': 29.9534, 'longitude': -90.0662}}, 'marker': ''},
    {'name': 'St. Louis Cathedral', 'location': {'coordinate':{'latitude': 29.957973, 'longitude': -90.063741}}, 'marker': ''}
];

//set-up yelp request
var yelpKey = 'zrk6D8Qi5dOr7ehfspHaqg';
var yelpSecret = '-jOfNf8vvxfhTOlsJpJ5pwRV52w';
var yelpToken = 'JJs5U3RWKuXOQLGLRAYYQquuUpwu63rc';
var yelpTokenSecret = 'pjbT1bYKg-poG-lyaGYHTfIWnYI';
var yelpUrl = 'https://api.yelp.com/v2/search?';

var parameters = {
    term: 'parks',
    location: 'New Orleans',
    oauth_consumer_key: yelpKey,
    oauth_token: yelpToken,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    callback: 'cb',
    limit: 15
};

function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
}

var encodedSignature = oauthSignature.generate('GET', yelpUrl, parameters, yelpSecret, yelpTokenSecret);
    parameters.oauth_signature = encodedSignature;

//handle errors with yelp request
var yelpRequestTimeout = setTimeout(function() {
        alert("Could not load Yelp data");
        ko.applyBindings(new viewModel());
    }, 5000);

    //create ajax call
    var settings = {
        url: yelpUrl,
        data: parameters,
        cache: true,
        jsonpCallback: 'cb',
        dataType: 'jsonp',
        success: function (data) {
            //replace default locations with yelp data
            var objectData = data.businesses;
            defaultLocations = [];
            objectData.forEach(function(object) {
            object.marker = '';
            defaultLocations.push(object);
            });
            initMap();
            ko.applyBindings(new viewModel());
            clearTimeout(yelpRequestTimeout);
        },
    };
$.ajax(settings);
var infowindow;
//Create Google Map
function initMap() {
    var initialLatLng = {lat: 29.9586, lng: -90.0650};
  // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
    center: initialLatLng,
    scrollwheel: true,
    zoom: 13
  });
    infowindow = new google.maps.InfoWindow();

    //Create Markers for all locations in the default locations array

    defaultLocations.forEach(function(park) {
        var latLng = new google.maps.LatLng(park.location.coordinate.latitude, park.location.coordinate.longitude);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: park.name
        });

        park.marker = marker;
        //Populate infowindow with data
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                markerBounce(marker);
                infowindow.setContent(
                    '<div class="parkInfo">'+
                    '<h3>' + park.name + '</h3>'+
                    '<h3>Rating: ' + park.rating + '   ' +
                    '<img width="40" height="10" src="' + park.rating_img_url_small + '">'+'</h3>'+
                     '<img width="100%" height="100%" src="' + park.image_url + '">'+
                     '</div>'
                    );
                infowindow.open(map, marker);
                map.panTo(marker.getPosition());
            };

            //Add marker animation on click
            function markerBounce(marker) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(stopBounce, 2100);

            function stopBounce() {
                marker.setAnimation(null);
                }
            }
        })(marker));
    });
}//End initMap

var loadError = function() {
    alert('Unable to load google map!');
};



var viewModel = function() {
    var self = this;
    self.selectedLocation = ko.observable('');
    self.locations = ko.observableArray(defaultLocations);
    self.filter = ko.observable('');
    console.log(defaultLocations);
    //respond to what the user types in the filter
    self.query = ko.computed(function() {
        return ko.utils.arrayFilter(self.locations(), function(location) {
            if(location.name.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                return true;
            } else {
                location.marker.setVisible(false);
                return false;
            }
        });
    });
    //respond to user interaction with the location list
    self.toggleMarker = function(listMarker) {
        self.selectedLocation(listMarker);
        google.maps.event.trigger(listMarker.marker, 'click');
    };
};//End viewModel

