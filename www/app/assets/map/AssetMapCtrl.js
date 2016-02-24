
angular.module('warehouse').controller('AssetsMapCtrl',
  ['$scope',
    '$q',
    '$filter',
    'geoLocationServices',
    'assetServices',
    'uiGmapIsReady',

    function($scope,$q,$filter,geoLocationServices, assetServices, uiGmapIsReady) {

      var createMarker = function(obj){

      };

      var createMapMarkers = function(assets){
        var markers = [];
        var i = 0;
        angular.forEach(assets, function(asset, key){
          var lat = asset.location.geometry.location.lat,
            lng = asset.location.geometry.location.lng;
          if(posWithinMapBounds(lat ,lng)){
            markers[i] = {
              id : i,
              $id : asset.$id,
              latitude: lat,
              longitude: lng,
              title: asset.name
            };
            //var found = $filter('filter')(unMappedAssets, {$id: asset.$id}, true);
            if(unMappedAssets[asset.$id]) unMappedAssets[asset.$id] = null;//
            mappedAssets[i] = asset;
          }else{
            if(!unMappedAssets[asset.$id])
              unMappedAssets[asset.$id] = asset;
          }
          i++;
        });
        return markers;
      };

      var posWithinMapBounds = function(lat ,lng) {
          if($scope.map.instance.getBounds().contains(geoLocationServices.geoCodeFromCoords(lat, lng))){
            return true;
          }else{
            return false;
          }
      };

      var updateMap = function(){

      };

      var mappedAssets = [], unMappedAssets = [], allAssets = assetServices.getAssets();

      $q.all([
        geoLocationServices.getCurrentLocation()
      ]).then(function(data){
        var position = data[0];
        $scope.map = {
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          zoom: 15,
          bounds: {},
          control : {},
          markers : [],
          instance : {},
          events : {
            dragend: function (maps, eventName, args) {
              console.log('drag',maps, eventName, args);
              var assetMarkers = createMapMarkers(unMappedAssets);
              $scope.map.markers = assetMarkers;
            },
            zoom_changed: function (maps, eventName, args) {
              console.log('zoom', maps, eventName, args);
            }
          }
        };

        uiGmapIsReady.promise().then(function (maps) {
          $scope.map.instance = $scope.map.control.getGMap();
          $scope.map.markers  = createMapMarkers(allAssets);
        });


      });

  }]);

