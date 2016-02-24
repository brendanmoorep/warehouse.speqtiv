(function(){
  angular.module('warehouse').controller('AssetDetailsCtrl',
    ['$scope',
      '$stateParams',
      '$cordovaGeolocation',

      function($scope, $stateParams, $cordovaGeolocation) {

        console.log($cordovaGeolocation);
        var options = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(options)
          .then(function(position) {

            $scope.map = {
              center: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              zoom: 12,
              bounds: {}
            };

          });

  }]);
})();

