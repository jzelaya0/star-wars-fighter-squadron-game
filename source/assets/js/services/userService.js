// source/assets/js/services/userService.js
(function() {
  'use strict';

  angular
    .module('userService', [])
    .factory('User', function($http){
      // create empty factory object
      userFactory = {};

      // Get all users
      // ******************************
      userFactory.getAllUsers = function(){
        return $http.get('api/users/');
      };

      // Get one user
      // ******************************
      userFactory.getOneUser = function(id){
        return $http.get('api/users/' + id);
      };

      // Create one user
      // ******************************
      userFactory.createUser = function(userData){
        return $http.post('api/register/', userData);
      };

      // Edit one user
      // ******************************
      userFactory.editUser = function(id, userData){
        return $http.put('api/users/' + id,  userData);
      };

      // Delete one user
      // ******************************
      userFactory.deleteUser = function(id){
        return $http.delete('api/users/' + id);
      };

      // return the userFactory object
      return userFactory;

    });

}());
