(function(){
  angular.module('warehouse')
    .factory('geoLocationServices',
      ['$q',
        '$cordovaGeolocation',
        'uiGmapGoogleMapApi',

        function($q, $cordovaGeolocation, uiGmapGoogleMapApi){

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

            var options = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation.getCurrentPosition(options)
              .then(function(position) {
                deferred.resolve(position);
              });

            return deferred.promise;
          };

          return {
            geoCodeFromCoords : geoCodeFromCoords,
            geoCodeAddress : geoCodeAddress,
            getCurrentLocation : getCurrentLocation
          }

    }]);

})();
