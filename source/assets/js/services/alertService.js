// source/assets/js/services/alertService.js
(function() {
  'use strict';

  angular
    .module('alertService', [])
    .factory('Alerts', function($rootScope){
        // create an empty object
        var alertService = {};

        // alerts will be available globally
        $rootScope.alerts = [];

        // Push messages and types to global array
        // ******************************
        alertService.addAlert = function(type, message){
          $rootScope.alerts.push({
            type: type,
            message: message,
            close: function(){
              return alertService.closeAlert(this);
            }
          });
          console.log($rootScope.alerts);
        };

        // Close alert message
        // ******************************
        alertService.closeAlert = function(alert){
          //Remove the alert message
          return this.closeAlertIndex($rootScope.alerts.indexOf(alert));
        };

        // Remove alert index
        // ******************************
        alertService.closeAlertIndex = function(index){
          return $rootScope.alerts.splice(index, 1);
        };

        // return ther alertService object
        return alertService;

    });

}());
