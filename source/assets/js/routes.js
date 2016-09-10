// source/assets/js/app.js
(function() {
  'use strict';

  angular
    .module('appRoutes', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider){

      $urlRouterProvider.otherwise('/home');

      $stateProvider
        // Route for home page
        .state('home', {
          url: '/home',
          templateUrl: 'pages/_home.html'
        })
        // Route for sign up page
        .state('signup', {
          url: '/signup',
          templateUrl: 'pages/_signup.html',
          controller: 'signUpController',
          controllerAs: 'signup'
        })
        // Route for login page
        .state('login', {
          url: '/login',
          templateUrl: 'pages/_login.html',
          controller: 'loginController',
          controllerAs: 'login'
        })
        // Route for main game page
        .state('game', {
          url: '/game',
          templateUrl: 'pages/_game.html',
          controller: 'gameController',
          controllerAs: 'game'
        })
        // Nested game view for player Stats
        .state('game.stats', {
          templateUrl: 'pages/game/_player-stats.html',

        });

        // Remove url hash
        $locationProvider.html5Mode(true);

    });


}());
