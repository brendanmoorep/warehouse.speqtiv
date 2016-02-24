(function(){
  angular.module('warehouse')
    .factory('geoLocationServices', ['$q', 'uiGmapGoogleMapApi',function($q, uiGmapGoogleMapApi){


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

      return {
        geoCodeAddress : geoCodeAddress
      }

    }]);

})();
