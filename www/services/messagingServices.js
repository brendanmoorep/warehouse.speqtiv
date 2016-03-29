(function(){
  angular.module('warehouse')
    .factory('messagingServices', ['$rootScope','$cordovaLocalNotification','$cordovaDialogs',
    function($rootScope,$cordovaLocalNotification,$cordovaDialogs){

      var showAppMessage = function(title, message, buttonText){
        if($rootScope.isBackground){
          var alarmTime = new Date();
          alarmTime.setMinutes(alarmTime.getMinutes());
          $cordovaLocalNotification.add({
            id: "1",
            date: alarmTime,
            message: message,
            title: title,
            autoCancel: true,
            sound: null
          });
        }else{
          alert(message, title, buttonText);
        }
      };

      return {
        showAppMessage : showAppMessage
      }
    }]);



})();
