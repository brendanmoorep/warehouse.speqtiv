(function(){
  angular.module('warehouse')
    .constant('DB_URL','https://warehouse-speqtiv.firebaseio.com/')
    .factory('assetServices', ['DB_URL',function(DB_URL){
      var assets = JSON.parse('[{"id" : "1", "name" : "asset 1", "lat" : "1234", "long" : "0000"},{"id" : "2", "name" : "asset 2", "lat" : "1234", "long" : "0000"},{"id" : "3", "name" : "asset 3", "lat" : "1234", "long" : "0000"}]');
      var getAssets = function(){
        return assets;
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
        getAssets : getAssets,
        addAsset : addAsset
      }
    }]);



})();
