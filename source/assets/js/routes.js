// source/assets/js/app.js
(function() {
  'use strict';

  angular
    .module('appRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider){

      $routeProvider
        // Route for home page
        .when('/', {
          templateUrl: 'templates/_home.html'
        });

        // Remove url hash
        $locationProvider.html5Mode(true);
    });


}());
