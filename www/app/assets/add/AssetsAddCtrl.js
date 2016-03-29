(function(){
  angular.module('warehouse').controller('AssetsAddCtrl', [
    '$scope',
    'geoLocationServices',
    'assetServices',
    'uiGmapGoogleMapApi',

    function($scope,geoLocationServices, assetServices, uiGmapGoogleMapApi) {
    $scope.asset = {};

    $scope.addAsset = function(){

      geoLocationServices.geoCodeAddress($scope.asset.address).then(function(result){
        if(result.success = true){

          $scope.asset.location = result.location;
          assetServices.addAsset($scope.asset);

        }else{
          console.log('There was an error geocoding the address.' + geoCodedAddress.status);
        }
      });

    };

  }]);
})();



