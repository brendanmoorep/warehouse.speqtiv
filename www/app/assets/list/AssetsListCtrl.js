angular.module('warehouse').controller('AssetsListCtrl',['$scope','$rootScope','assetServices', function($scope,$rootScope, assetServices){
  assetServices.getAssets().then(function(){
    $scope.assets = $rootScope.assets;
  });
}]);



