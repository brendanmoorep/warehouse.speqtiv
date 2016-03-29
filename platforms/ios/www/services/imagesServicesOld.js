(function(){
  angular.module('warehouse')
    .factory('imageServices', ['$rootScope', '$q', '$http',
      function($rootScope, $q, $http){

        var originalImage;

        var dataURItoBlob = function(dataURI) {
          var binary = atob(dataURI.split(',')[1]);
          var array = [];
          for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        };

        var getDimensions = function(w, h){
          var maxW = 1000, maxH = 1000, tempW, tempH;
          if((w > h) && w > maxW){
            tempW = maxW;
            tempH = (tempImg.height * maxW) / tempImg.width;
          }else if((h >= w) && h > maxH){
            tempH = maxH;
            tempW = (tempImg.width * maxH) / tempImg.height;
          }

          return {
            width : tempW,
            height : tempH
          };
        };


        var getResizedImage = function(img, proportion, fileSize) {
          var deferred = $q.defer();
          var reader = new FileReader();
          reader.onloadend = function() {
            var tempImg = new Image();
            tempImg.src = reader.result;
            tempImg.onload = function() {
              var tempW = Math.round(tempImg.width * (proportion / 100));
              var tempH = Math.round(tempImg.height * (proportion / 100));
              var canvas = document.createElement('canvas');
              canvas.width = tempW;
              canvas.height = tempH;
              var ctx = canvas.getContext("2d");
              ctx.drawImage(this, 0, 0, tempW, tempH);
              var dataURL = canvas.toDataURL("image/jpeg");
              var blob = dataURItoBlob(dataURL);
              //var file = new File([blob],fileSize + "-" + originalImage.name, {type: "image/jpeg"});

              deferred.resolve({
                success : true,
                file : {
                  name : fileSize + "-" + originalImage.name,
                  type : "image/jpeg",
                  imgData : blob
                }
              });
            }; //onlaod
          };
          reader.readAsDataURL(img);
          return deferred.promise;
        };

        var resizeAndUploadImage = function(image, callback, errback){
          originalImage = image;
          var fileName = '';
          var proportions = [100];
          angular.forEach(proportions, function(proportion){
            if(proportion == 100){
              fileName = 'lg'
            }else if(proportion == 50){
              fileName = 'med';
            }else{
              fileName = 'sml';
            }
            getResizedImage(originalImage, proportion, fileName).then(function(data){
              if(data.success){
                postImageData(data.file,  callback, errback).then(function(){
                  var test = '';
                });
              }else{
                console.log('errer', data);
              }
            });
          });
        };

        var postImageData = function(file, callback, errback){
          var deferred = $q.defer();
          AWS.config.update({accessKeyId: 'AKIAIRUH2LEHAUMU55BA', secretAccessKey: '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'});
          AWS.config.region = 'us-west-2';
          var bucket = new AWS.S3({ params: {Bucket: 'shareeverymile'} });
          var params = {Key: file.name, ContentType: file.type, Body: file.imgData};
          bucket.upload(params, function (err, data) {
            if(err){
              if(angular.isFunction(errback)) errback(err);
              deferred.resolve(false, err);
            }else{
              if(angular.isFunction(callback)) callback(data);
              deferred.resolve(true, data);
            }
          });

          return deferred.promise;
        };

        var uploadImage = function(imageData, callback, errback){
          var deferred = $q.defer();


          return deferred.promise;
        };

        return {
          uploadImage : uploadImage,
          resizeAndUploadImage : resizeAndUploadImage,
          getResizedImage : getResizedImage,
          postImageData : postImageData
        }

      }]);



})();
