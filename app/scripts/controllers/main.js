'use strict';

/**
 * @ngdoc function
 * @name snugBabyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the snugBabyApp
 */
angular.module('snugBabyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
