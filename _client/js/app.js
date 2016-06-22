// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngMaterial'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider, $mdGestureProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $mdGestureProvider.skipClickHijack(); //[lame|notice] prevent one click two fires
  $ionicConfigProvider.tabs.position('top');
  $ionicConfigProvider.navBar.alignTitle('center');
  
  $stateProvider

  .state('root', {
    url : '/root',
    templateUrl : 'templates/root.html',
    controller : 'rootCtrl'
  })

  .state('seat', {
    url: '/seat',
    templateUrl: 'templates/tab-seat-popup.html',
    controller: 'seatCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.agenda', {
    url: '/agenda',
    views: {
      'tab-agenda': {
        templateUrl: 'templates/tab-agenda.html',
        //controller: 'seatCtrl'
      }
    }
  })

  .state('tab.draw', {
    url: '/draw',
    views: {
      'tab-draw': {
        templateUrl: 'templates/tab-draw.html',
        controller: 'drawCtrl'
      }
    }
  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'dashCtrl'
      }
    }
  })

  .state('tab.video', {
      url: '/video',
      views: {
        'tab-video': {
          templateUrl: 'templates/tab-video.html',
          controller: 'videoCtrl'
        }
      }
    })
  .state('tab.question', {
      url: '/question/:qId',
      views: {
        'tab-question': {
          templateUrl: 'templates/question-detail.html',
          controller: 'qDetailCtrl'
        }
      }
    })
  .state('tab.feedback', {
      url: '/feedback',
      views: {
        'tab-feedback': {
          templateUrl: 'templates/tab-feedback.html',
          controller: 'fbCtrl'
        }
      }
    });  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/root');

});
