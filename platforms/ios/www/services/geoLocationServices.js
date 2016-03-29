(function(){
  angular.module('warehouse')
    .factory('geoLocationServices',
      ['$q',
        '$cordovaGeolocation',
        'uiGmapGoogleMapApi',
        '$cordovaBackgroundGeolocation',

        function($q, $cordovaGeolocation, uiGmapGoogleMapApi,$cordovaBackgroundGeolocation){

          var geoCodeFromCoords = function(lat ,lng){
            return new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
          };

          var geoCodeAddress = function(address){
            var deferred = $q.defer();
            var coderSuccess = {
              success : false,
              status : "",
              location : {}
            };

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode( { 'address': address }, function(results, status) {

              if (status == google.maps.GeocoderStatus.OK) {
                coderSuccess.success = true;
                coderSuccess.status = status;
                coderSuccess.location = results[0];
              }else{
                coderSuccess.success = false;
                coderSuccess.status = status;
              }

              deferred.resolve(coderSuccess);

            });

            return deferred.promise;
          };

          var getCurrentLocation = function(){
            var deferred = $q.defer();
            console.log($cordovaBackgroundGeolocation);
            var options = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation.getCurrentPosition(options)
              .then(function(position) {
                deferred.resolve(position);
              });

            return deferred.promise;
          };

          var getDistanceBetweenPoints = function(latlng1, latlng2){
            return google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);
          };

          var watchCurrentPosition = function(callback){
            var watchOptions = {
              timeout : 3000,
              enableHighAccuracy: true
            };

            var watch = $cordovaGeolocation.watchPosition(watchOptions);
            watch.then(
              null,
              function(err) {
                console.log('error while watching location');
              },
              function(position) {
                console.log('watching position');
                callback({
                  lat : position.coords.latitude,
                  lng : position.coords.longitude
                });
              });

            return watch;
          };

          var watchCurrentPositionBg = function(successBack, errorBack, options){
            var pluginOptions = options || {
                desiredAccuracy: 0,
                stationaryRadius: 10,
                distanceFilter: 10,
                disableElasticity: false, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
                locationUpdateInterval: 3000,
                stopTimeout : 5,
                minimumActivityRecognitionConfidence: 0,   // 0-100%.  Minimum activity-confidence for a state-change
                fastestLocationUpdateInterval: 3000,
                activityRecognitionInterval: 3000,
                activityType: 'Fitness',//, 'AutomotiveNavigation',
                debug: false
            };
            try{
              var bgGeo = window.BackgroundGeolocation;
              bgGeo.configure(function(location, taskId){
                successBack(location, taskId);
              }, errorBack, pluginOptions);
              bgGeo.start();
              bgGeo.changePace(true, function(message){
                console.log('success changepace', message);
              },function(message){
                console.log('failure changepace', message);
              });
            }catch(error){
              console.log('error', error);
            }


          };

          return {
            geoCodeFromCoords : geoCodeFromCoords,
            geoCodeAddress : geoCodeAddress,
            getCurrentLocation : getCurrentLocation,
            getDistanceBetweenPoints : getDistanceBetweenPoints,
            watchCurrentPosition : watchCurrentPosition,
            watchCurrentPositionBg : watchCurrentPositionBg
          }

    }]);

})();
