// source/assets/js/services/authService.js
(function() {
  'use strict';

  angular
    .module('authService', [])

    // ==================================================
    // FACTORY FOR LOGGING IN & OUT
    // ==================================================
    .factory('Auth', function($q, $http, AuthToken, PlayerStats){
      // create empty factory object
      var authFactory = {};

      // Log User in
      // ******************************
      authFactory.logUserIn = function(username, password){
        // post username and password
        return $http.post('/api/authenticate/', {
          username: username,
          password: password
        })
          .success(function(data){
            // Set token on success
            AuthToken.setUserToken(data.token);
            return data;
          });

      };

      // Log User out
      // ******************************
      authFactory.logUserOut = function(){
        // remove the token
        AuthToken.setUserToken();
        // remove the player stats
        PlayerStats.removePlayerStats();
      };

      // Check if user is logged in
      // ******************************
      authFactory.isUserLoggedIn = function(){
        //get user token from AuthToken factory
        if(AuthToken.getUserToken()){
          return true;
        }else {
          return false;
        }
      };

      // Get logged in user's profile info
      // ******************************
      authFactory.getUserProfileInfo = function(token){
        if (AuthToken.getUserToken()) {
          return $http.get('/api/users/profile');
        }else {
          return $q.reject({message: "User does not have a token!"});
        }
      };

      // return the authFactory object
      return authFactory;

    })// end Auth

    // ==================================================
    // FACTORY FOR SETTING TOKENS
    // ==================================================
    .factory('AuthToken', function($window){
      // create empty factory object
      var authTokenFactory = {},
        LOCAL_TOKEN_KEY = 'userToken';

      // Get the user token
      // ******************************
      authTokenFactory.getUserToken = function(){
        var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);

        return token;
      };

      // Get the user token
      // ******************************
      authTokenFactory.setUserToken = function(token){
        // set token in local storage
        if(token){
          $window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        }else {
          // remove token from local storage if no token
          $window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }
      };

      // return the authTokenFactory object
      return authTokenFactory;
    })// end AuthToken

    // ==================================================
    // FACTORY FOR INTEGRATING TOKENS INTO REQUEST
    // ==================================================
    .factory('AuthInterceptor', function($location, $q, AuthToken){
      // create empty factory object
      var authInterceptorFactory = {};

      // Set the token to all HTTP requests
      // ******************************
      authInterceptorFactory.request = function(config){
        var passedToken = AuthToken.getUserToken();
        // set token on headers
        if(passedToken){
          config.headers['x-access-token'] = passedToken;
        }

        return config;
      };

      // Handle response errors
      // ******************************
      authInterceptorFactory.responseError = function(response){
        if(response.status == 403){
          $location.path('/');
        }

        //return the errors from the server as a promise
        return $q.reject(response);
      };

      // return the authInterceptorFactory object
      return authInterceptorFactory;
    });
}());
