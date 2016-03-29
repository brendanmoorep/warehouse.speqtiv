
angular.module('warehouse').controller('AssetsMapCtrl',
  ['$scope',
    '$rootScope',
    '$q',
    '$filter',
    'geoLocationServices',
    'assetServices',
    'uiGmapIsReady',
    'messagingServices',

    function($scope,
             $rootScope,
             $q,$filter,
             geoLocationServices,
             assetServices,
             uiGmapIsReady,
             messagingServices) {
      var userLocation = {}, mappedAssets = [], unMappedAssets = [];
      $rootScope.nearbyAssets = [];

      var createMapMarkers = function(assets){
        var markers = [], i = 0;
        angular.forEach(assets, function(asset, key){
          var lat = asset.location.geometry.location.lat,
              lng = asset.location.geometry.location.lng;

          var latlng = new google.maps.LatLng(lat,lng);

          if(true/*posWithinMapBounds(lat ,lng)*/){
            markers[i] = {
              id : i,
              $id : asset.$id,
              latitude: lat,
              longitude: lng,
              title: asset.name,
              latlng : latlng,
              asset : asset
            };
          }
          i++;
        });
        return markers;
      };

      var posWithinMapBounds = function(lat,lng) {
          return $scope.map.instance.getBounds().contains(geoLocationServices.geoCodeFromCoords(lat, lng));
      };

      var assetAlreadyTaggedAsClose = function(id) {
        return _.contains(_.pluck($rootScope.nearbyAssets, '$id'), id);
      };

      var updateMapCenter = function(currentPosition){
        if($scope.map.instance && $scope.map.instance.setCenter){
          $scope.map.instance.setCenter(currentPosition);

          new google.maps.Marker({
            map: $scope.map.instance,
            title: 'Current Location',
            position: currentPosition,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#2677FF',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeOpacity: 1,
              strokeWeight: 6
            }
          });

        }

      };

      var watchPositionCallback = function(location, taskId){
        window.BackgroundGeolocation.finish(taskId);
        var distance = 0;
        var currentPosition = new google.maps.LatLng(parseFloat(location.coords.latitude),parseFloat(location.coords.longitude));

        updateMapCenter(currentPosition);

        angular.forEach($scope.map.markers, function(marker){
          distance = geoLocationServices.getDistanceBetweenPoints(currentPosition, marker.latlng);
          if(distance < 150){ //in meters (1 ft = .3048m)
            if(!assetAlreadyTaggedAsClose(marker.$id)){
              $rootScope.nearbyAssets.push(marker);
              if(marker.asset.serviceRequests && marker.asset.serviceRequests.length > 0){
                messagingServices.showAppMessage('Nearby Service Request', marker.asset.name + ' has ' + marker.asset.serviceRequests.length + ' unattended service requests');
              }
            }else{
              console.log('asset already known to be close');
            }

          }else{
            if(assetAlreadyTaggedAsClose(marker.$id)){
              //remove the asset from nearbyAssets if there since it is no longer near.
              $rootScope.nearbyAssets = _.reject($rootScope.nearbyAssets, function(item){ return item.$id == marker.$id; });
            }
          }
        });
      };

      var watchPositionErrorBack = function(error){
        console.log('watching position failure:', error);
      };

      $q.all([
        geoLocationServices.getCurrentLocation()
      ]).then(function(data){
        var position = data[0];

        userLocation.lastLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        $scope.map = {
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          zoom: 17,
          bounds: {},
          control : {},
          markers : [],
          instance : {},
          events : {
            dragend: function (maps, eventName, args) {
              console.log('drag',maps, eventName, args);
              //var assetMarkers = createMapMarkers(unMappedAssets);
              //$scope.map.markers = assetMarkers;
            },
            zoom_changed: function (maps, eventName, args) {
              console.log('zoom', maps, eventName, args);
            }
          }
        };


        uiGmapIsReady.promise().then(function (maps) {
          $scope.map.instance = $scope.map.control.getGMap();
          assetServices.getAssets().then(function(){
            $scope.map.markers  = createMapMarkers($rootScope.assets);
          });
        });

        document.addEventListener("deviceready", function () {
          setTimeout(function(){
            //has problems without waiting a second
            geoLocationServices.watchCurrentPositionBg(watchPositionCallback,watchPositionErrorBack);
          },1000);

        });

        document.addEventListener("pause", function(){
          $rootScope.isBackground = true;
        }, false);

        document.addEventListener("resume", function(){
          $rootScope.isBackground = false;
        }, false);


      });

  }]);

