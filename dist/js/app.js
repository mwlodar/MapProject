function nonce_generate(){return Math.floor(1e12*Math.random()).toString()}function initMap(){var e={lat:29.9586,lng:-90.065},o=new google.maps.Map(document.getElementById("map"),{center:e,scrollwheel:!0,zoom:12});infowindow=new google.maps.InfoWindow,defaultLocations.forEach(function(e){var a=new google.maps.LatLng(e.location.coordinate.latitude,e.location.coordinate.longitude),t=new google.maps.Marker({position:a,map:o,title:e.name});e.marker=t,t.addListener("visible_changed",function(){infowindow.close(o,t)}),google.maps.event.addListener(t,"click",function(a){function t(e){function o(){e.setAnimation(null)}e.setAnimation(google.maps.Animation.BOUNCE),setTimeout(o,3e3)}return function(){t(a),infowindow.setContent('<div class="parkInfo"><h3>'+e.name+"</h3><h3>Rating: "+e.rating+'   <img width="40" height="10" src="'+e.rating_img_url_small+'"></h3><img width="100%" height="100%" src="'+e.image_url+'"></div>'),infowindow.open(o,a)}}(t))})}var defaultLocations=[{name:"Jackson Square",location:{coordinate:{latitude:29.957466,longitude:-90.062972}},marker:""},{name:"Woldenberg Park",location:{coordinate:{latitude:29.9533,longitude:-90.063}},marker:""},{name:"Cafe Du Monde",location:{coordinate:{latitude:29.957491,longitude:-90.061811}},marker:""},{name:"House of Blues",location:{coordinate:{latitude:29.9534,longitude:-90.0662}},marker:""},{name:"St. Louis Cathedral",location:{coordinate:{latitude:29.957973,longitude:-90.063741}},marker:""}],yelpKey="zrk6D8Qi5dOr7ehfspHaqg",yelpSecret="-jOfNf8vvxfhTOlsJpJ5pwRV52w",yelpToken="JJs5U3RWKuXOQLGLRAYYQquuUpwu63rc",yelpTokenSecret="pjbT1bYKg-poG-lyaGYHTfIWnYI",Yelpurl="https://api.yelp.com/v2/search?",parameters={term:"parks",location:"New Orleans",oauth_consumer_key:yelpKey,oauth_token:yelpToken,oauth_nonce:nonce_generate(),oauth_timestamp:Math.floor(Date.now()/1e3),oauth_signature_method:"HMAC-SHA1",callback:"cb",limit:15},encodedSignature=oauthSignature.generate("GET",Yelpurl,parameters,yelpSecret,yelpTokenSecret);parameters.oauth_signature=encodedSignature;var settings={url:Yelpurl,data:parameters,cache:!0,jsonpCallback:"cb",dataType:"jsonp",success:function(e){var o=e.businesses;defaultLocations=[],o.forEach(function(e){e.marker="",defaultLocations.push(e)}),initMap(),ko.applyBindings(new viewModel)},error:function(){alert("failed to load yelp data"),ko.applyBindings(new viewModel)}};$.ajax(settings);var loadError=function(){alert("Unable to load google map!")},viewModel=function(){var e=this;e.selectedLocation=ko.observable(""),e.locations=ko.observableArray(defaultLocations),e.filter=ko.observable(""),console.log(defaultLocations),e.query=ko.computed(function(){return ko.utils.arrayFilter(e.locations(),function(o){return o.name.toLowerCase().indexOf(e.filter().toLowerCase())>=0?(o.marker.setVisible(!0),!0):(o.marker.setVisible(!1),!1)})}),e.toggleMarker=function(o){e.selectedLocation(o),google.maps.event.trigger(o.marker,"click")}};