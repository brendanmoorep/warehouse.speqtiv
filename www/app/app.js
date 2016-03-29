// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('warehouse', ['ngCordova','ionic', 'firebase','uiGmapgoogle-maps'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
        if(device.platform === "iOS") {
          window.plugin.notification.local.promptForPermission();
        }
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/layout/layout.html',
        controller: 'AppCtrl'
      })


      .state('app.assets', {
        url: '/assets',
        views: {
          'mainContent': {
            templateUrl: 'app/assets/list/assetList.html',
            controller: 'AssetsListCtrl'
          }
        }
      })

      .state('app.assetDetails', {
        url: '/assets/:id',
        views: {
          'mainContent': {
            templateUrl: 'app/assets/details/assetDetails.html',
            controller: 'AssetDetailsCtrl'
          }
        }
      })

      .state('app.assets.list', {
        url: '/asset-list',
        views: {
          'mainContent': {
            templateUrl: 'app/assets/list/assetList.html',
            controller: 'AssetsListCtrl'
          }
        }
      })

      .state('app.addAsset', {
        url: '/add-asset',
        views: {
          'mainContent': {
            templateUrl: 'app/assets/add/assetAdd.html',
            controller: 'AssetsAddCtrl'
          }
        }
      })

      .state('app.edit', {
        url: '/edit-asset',
        views: {
          'mainContent': {
            templateUrl: 'app/assets/edit/assetEdit.html',
            controller: 'AssetsEditCtrl'
          }
        }
      })

      .state('app.map', {
        url: '/map',
        views: {
          'mainContent': {
            templateUrl: 'app/assets/map/assetMap.html',
            controller: 'AssetsMapCtrl'
          }
        }
      })

      .state('app.issues', {
        url: '/issues',
        views: {
          'mainContent': {
            templateUrl: 'app/issues/issues.html',
            controller: 'IssuesCtrl'
          }
        }
      })

      .state('app.requests', {
        url: '/requests',
        views: {
          'mainContent': {
            templateUrl: 'app/requests/requests.html',
            controller: 'RequestsCtrl'
          }
        }
      })

      .state('app.account', {
        url: '/account',
        views: {
          'mainContent': {
          templateUrl: 'app/account/account.html',
          controller: 'AccountCtrl'
        }
      }
     });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/assets');
  });




