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
          views: {
            // Root game page
            '': {
              templateUrl: 'pages/_game.html',
              controller: 'gameController',
              controllerAs: 'game'
            },
            // Stats panel
            'stats@game': {
              templateUrl: 'pages/game/_player-stats.html',
            },
            // Game instructions panel
            'howToPlay@game': {
              templateUrl: 'pages/game/_how-to-play.html'
            }
          }
        })
        // Route for the profile page
        .state('profile', {
          url: '/profile',
          templateUrl: 'pages/_profile.html',
          controller: 'profileController',
          controllerAs: 'profile'
        });

        // Remove url hash
        $locationProvider.html5Mode(true);

    });


}());
