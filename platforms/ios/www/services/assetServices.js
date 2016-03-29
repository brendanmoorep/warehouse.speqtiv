(function(){
  angular.module('warehouse')
    .constant('DB_URL','https://warehouse-speqtiv.firebaseio.com/')
    .factory('assetServices', ['$rootScope','$q','DB_URL', '$firebaseArray','$cordovaLocalNotification','$cordovaDialogs',function($rootScope,$q,DB_URL, $firebaseArray,$cordovaLocalNotification,$cordovaDialogs){

      var assetsRef = {};

      var getAssets = function(){
        var deferred = $q.defer();
        var assetsRef = new Firebase(DB_URL).child('assets');
        console.log(assetsRef);
        var assetsArray = $firebaseArray(assetsRef);
        $rootScope.assetsRef = assetsRef;
        $rootScope.assets = assetsArray;
        assetsArray.$loaded(function() {
          deferred.resolve();
        });
        return deferred.promise;
      };

      var getAsset = function(assetId){
        var deferred = $q.defer();
        if(!$rootScope.assets){
          getAssets().then(function(){
            deferred.resolve($rootScope.assets.$getRecord(assetId));
          });
        }else{
            deferred.resolve($rootScope.assets.$getRecord(assetId));
        }

        return deferred.promise;
      };

      var addAsset = function(asset){
        var fireBase = new Firebase(DB_URL).child('assets');
        asset.location.geometry.location.lat = asset.location.geometry.location.lat();
        asset.location.geometry.location.lng = asset.location.geometry.location.lng();

        fireBase.push()
          .set({
            type : asset.type || "",
            name : asset.name || "",
            location : angular.copy(asset.location) /*|| {
              lat: asset.long || "",
              long: asset.long || ""/
            }*/
          }, function(saveError){
            if(saveError){
              console.log('Error saving asset:' + saveError);
              return false;
            }else{
              console.log('Success!');
              return true;
            }
          });
      };

      return {
        assetsRef : assetsRef,
        getAssets : getAssets,
        getAsset : getAsset,
        addAsset : addAsset
      }
    }]);



})();
