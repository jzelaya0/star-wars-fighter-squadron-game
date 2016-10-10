// source/assets/js/app.js
(function() {
  'use strict';

  angular
    .module('swfsGameApp', [
      'appRoutes',
      'mainCtrl',
      'loginCtrl',
      'gameCtrl',
      'profileCtrl',
      'editProfileCtrl',
      'scoreboardCtrl',
      'alertService',
      'authService',
      'userService',
      'gameService',
      'gameBootService',
      'gameLoadService',
      'gameMenuService',
      'gamePlayService',
      'playerStatsService',
      'signUpCtrl',
      'ui.bootstrap',
      'ngMessages',
      'ngAnimate',
      'angularUtils.directives.dirPagination',
      'ng.deviceDetector'
    ])

    .config(function($httpProvider){
      // attach AuthInterceptor to requests
      $httpProvider.interceptors.push('AuthInterceptor');
    });
}());
