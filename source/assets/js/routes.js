// source/assets/js/app.js
(function() {
  'use strict';

  angular
    .module('appRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider){

      $routeProvider
        // Route for home page
        .when('/', {
          templateUrl: 'pages/_home.html'
        })
        // Route for login page
        .when('/login', {
          templateUrl: 'pages/_login.html',
          controller: 'loginController',
          controllerAs: 'login'
        })
        .when('/game', {
          templateUrl: 'pages/_game.html',
        });

        // Remove url hash
        $locationProvider.html5Mode(true);
    });


}());
