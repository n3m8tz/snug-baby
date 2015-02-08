'use strict';

/**
 * @ngdoc function
 * @name snugBabyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the snugBabyApp
 */
angular.module('snugBabyApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
