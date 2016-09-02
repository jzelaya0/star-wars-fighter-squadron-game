// source/assets/js/app.js
(function() {
  'use strict';

  angular
    .module('swfsGameApp', [
      'appRoutes',
      'mainCtrl',
      'loginCtrl',
      'alertService',
      'authService',
      'userService',
      'gameService',
      'gameBootService',
      'gameLoadService',
      'gameMenuService',
      'gamePlayService',
      'signUpCtrl',
      'ui.bootstrap',
      'ngMessages'
    ])

    .config(function($httpProvider){
      // attach AuthInterceptor to requests
      $httpProvider.interceptors.push('AuthInterceptor');
    });
}());
