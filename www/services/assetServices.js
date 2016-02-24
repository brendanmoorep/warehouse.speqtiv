(function(){
  angular.module('warehouse')
    .constant('DB_URL','https://warehouse-speqtiv.firebaseio.com/')
    .factory('assetServices', ['$q','DB_URL', '$firebaseArray',function($q,DB_URL, $firebaseArray){


      var getAssets = function(){
        var deferred = $q.defer();
        var assetsRef = new Firebase(DB_URL).child('assets');
        //assetsRef.on("value", function(snapshot) {
        //  console.log(snapshot);
        //    deferred.resolve(snapshot.val());
        //  }, function (errorObject) {
        //      console.log("The read failed: " + errorObject.code);
        //  });
        return $firebaseArray(assetsRef);
        //return deferred.promise;
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
