(function(){
  angular.module('warehouse')
    .factory('imageServices', ['$rootScope', '$q', '$http',
      function($rootScope, $q, $http){

        var dataURItoBlob = function(dataURI) {
          var binary = atob(dataURI.split(',')[1]);
          var array = [];
          for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        };

        var getResizedImage = function(img, w, h, proportion) {
          var tempW = Math.round(w * (proportion / 100));
          var tempH = Math.round(h * (proportion / 100));
          var canvas = document.createElement('canvas');
          canvas.width = tempW;
          canvas.height = tempH;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, tempW, tempH);
          var dataURL = canvas.toDataURL("image/jpeg");
          var blob = dataURItoBlob(dataURL);
          //var file = new File([blob],fileSize + "-" + originalImage.name, {type: "image/jpeg"});
          return blob;
        };

        var postImageData = function(file, callback, errback){
          var deferred = $q.defer();
          AWS.config.update({accessKeyId: 'AKIAIRUH2LEHAUMU55BA', secretAccessKey: '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'});
          AWS.config.region = 'us-west-2';
          var bucket = new AWS.S3({ params: {Bucket: 'shareeverymile'} });
          //var params = {Key: file.name, ContentType: file.type, Body: file.imgData};
          bucket.upload(file, function (err, data) {
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

        var readImage = function(img){
          var deferred = $q.defer();
          var reader = new FileReader();
          reader.onloadend = function() {
            var tempImg = new Image();
            tempImg.src = reader.result;
            tempImg.onload = function() {
              deferred.resolve(tempImg);
            };
          };
          reader.readAsDataURL(img);
          return deferred.promise;
        };

        var getMaxDimensions = function(w, h){
          var maxW = 1000, maxH = 1000, tempW, tempH;
          if((w > h) && w > maxW){
            return {
              width : maxW,
              height : Math.round((tempImg.height * maxW) / tempImg.width)
            };
          }else if((h >= w) && h > maxH){
            return {
              width : Math.round((tempImg.width * maxH) / tempImg.height),
              height : maxH
            };
          }else{
            return {
              width : w,
              height : h
            };
          }
        };

        var getImageName = function(fileName, proportion){
          fileName = fileName.replace('.jpg', '');
          switch(proportion){
            case 100:
              return fileName + '_full.jpg';
              break;
            case 75:
              return fileName + '_lrg.jpg';
              break;
            case 50:
              return fileName + '_med.jpg';
              break;
            case 25:
              return fileName + '_sml.jpg';
              break;
          }
        };

        var uploadImage = function(file, callback, errback){
          var deferred = $q.defer(), blob, name;
          readImage(file).then(function(img){
            var dims = getMaxDimensions(img.width, img.height);
            var proportions = [100, 50, 25];
            angular.forEach(proportions, function(proportion){
              blob = getResizedImage(img, dims.width, dims.height, proportion);
              postImageData({
                Key: getImageName(file.name,proportion),
                ContentType: "image/jpeg",
                Body: blob}, callback, errback);
            });
          });

          return deferred.promise;
        };

        var downloadImage = function(){

        };

        return {
          uploadImage : uploadImage,
          getResizedImage : getResizedImage,
          postImageData : postImageData,
          dataURItoBlob : dataURItoBlob
        }

      }]);



})();
