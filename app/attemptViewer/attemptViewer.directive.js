// I had to remove the self invoking expression surrounding the code before this would work.
'use strict';

angular
  .module('app.attemptViewer', [])
  .directive("attemptViewer", function ($scope,
                                        $location,
                                        $http,
                                        $firebase,
                                        $firebaseObject,
                                        $firebaseArray,
                                        $firebaseAuth,
                                        Auth,
                                        $routeParams,
                                        currentAuth) {
    return {
      restrict: "E",
      templateUrl: 'app/attemptViewer/attemptViewer.html'
    };

  });


attemptViewer.$inject = [
  '$scope',
  '$location',
  '$http',
  '$firebase',
  '$firebaseObject',
  '$firebaseArray',
  '$firebaseAuth',
  'Auth',
  '$routeParams',
  'currentAuth'
];