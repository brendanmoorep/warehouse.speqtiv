angular.module('warehouse').controller('AssetsListCtrl',['$scope','assetServices', function($scope, assetServices){
  $scope.assets = assetServices.getAssets();
}]);



