(function(){
  angular.module('warehouse').controller('AssetDetailsCtrl',
    ['$scope',
      '$rootScope',
      '$stateParams',
      'assetServices',
      'geoLocationServices',
      'uiGmapGoogleMapApi',
      'uiGmapIsReady',
      '$ionicModal',
      '$cordovaCamera',
      'imageServices',

      function($scope,$rootScope, $stateParams,assetServices, geoLocationServices,uiGmapGoogleMapApi,uiGmapIsReady,$ionicModal,$cordovaCamera,imageServices) {
        $scope.assetImages = [];
        var initMap = function(){
          $scope.assetLatLng = new google.maps.LatLng($scope.asset.location.geometry.location.lat,$scope.asset.location.geometry.location.lng);
          var mapOptions = {
            zoom: 18,
            center: $scope.assetLatLng,
            mapTypeId: google.maps.MapTypeId.TERRAIN
          }

          $scope.map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
          $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: $scope.assetLatLng
          });
        };

        var uploadImageData = function(file, callback, errback){
          //var reader = new FileReader();
          //reader.onload = function(){
          //  var imgData = {
          //    file : file,
          //    data : reader.result
          //  };
          //
          //};
          //reader.readAsDataURL(file);

          //imageServices.uploadImage(imgData).then(function(success, data){
          //  if(success){
          //    console.log('success uploading img ', data);
          //    if(angular.isFunction(callback))callback(data);
          //  }else{
          //    console.log('error uploading img ', data);
          //    if(angular.isFunction(errback))errback(data);
          //  }
          //});
        };

        var initServiceRequestModal = function(){
          $ionicModal.fromTemplateUrl('service-request-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
          });

          $scope.openServiceRequestModal = function(){
            $scope.modal.show();
          };

          $scope.closeServiceRequestModal = function(){
            $scope.modal.hide();
          };

          $scope.saveServiceRequest = function(){
            $scope.serviceRequest.id = Math.round(new Date().getTime()/1000);
            $scope.asset.serviceRequests.push($scope.serviceRequest);
            $scope.asset.serviceRequests = angular.copy($scope.asset.serviceRequests);
            $rootScope.assetsRef.child($scope.asset.$id).child('serviceRequests').set($scope.asset.serviceRequests, function(error){
              if (error) {
                console.log('Synchronization failed', error);
              } else {
                $scope.closeServiceRequestModal();
              }
            });
          };
        };

        $scope.takePicture = function(){
          //Camera.DestinationType = {
          //  DATA_URL : 0,      // Return image as base64-encoded string
          //  FILE_URI : 1,      // Return image file URI
          //  NATIVE_URI : 2     // Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
          //};
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL, //FILE_URI
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 800,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
            //$scope.assetImages.push({src:"data:image/jpeg;base64," + imageData});
            //imageServices.uploadImage(imageData);
            imageServices.postImageData({
              Key: 'mytestimg2.jpg', ContentType: 'image/jpeg', Body: imageServices.dataURItoBlob("data:image/jpeg;base64," + imageData), ContentEncoding: 'base64'
            });
          }, function(err) {
            // error
            console.log(err);
          });
        };

        $scope.selectImage = function(){
          var options = {
            destinationType : Camera.DestinationType.DATA_URL, //FILE_URI
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY
          };

          //window.resolveLocalFileSystemURL("file:///localhost/var/mobile/Applications/96B4705C-C70D-4340-9A42-HJ1F28355D43/tmp/cdv_photo_015.jpg", function(fileEntry){
          //  console.log(fileEntry.name);
          //}, function(error){
          //  console.log('about to resolve this files errors');
          //  console.log(error.code);
          //});

          $cordovaCamera.getPicture(options).then(function(imageData) {
            //imageData example:
            //"file:///var/mobile/Containers/Data/Application/7CE626D7-6771-4613-A839-68ACBBAD2B47/tmp/cdv_photo_001.jpg"
            $scope.assetImages.push({src : imageData});
            //imageServices.uploadImage(imageData);

            imageServices.postImageData({
              Key: 'mytestimg2.jpg', ContentType: 'image/jpeg', Body: imageServices.dataURItoBlob("data:image/jpeg;base64," + imageData), ContentEncoding: 'base64'
            });

          }, function(err) {
            // error
            console.log(err);
          });
        };

        $scope.filePickerUpload = function(files){
          //data:image/jpeg;base64,/9j/4AAQSk
          if(files && files.length > 0){
            angular.forEach(files, function(file){
              imageServices.uploadImage(file);
            });
          }
        };

        assetServices.getAsset($stateParams.id).then(function(asset){
          $scope.serviceRequest = {};
          $scope.asset = asset;
          //initMap();
          initServiceRequestModal();
          if(asset.serviceRequests && asset.serviceRequests.length > 0){
            $scope.hasServiceRequests = true;
          }else{
            $scope.hasServiceRequests = false;
            asset.serviceRequests = [];
          }

        });



  }]);
})();

