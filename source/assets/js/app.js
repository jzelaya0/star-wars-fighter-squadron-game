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
      'ui.bootstrap'
    ])

    .config(function($httpProvider){
      // attach AuthInterceptor to requests
      $httpProvider.interceptors.push('AuthInterceptor');
    });
}());
