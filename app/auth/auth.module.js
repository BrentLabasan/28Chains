(function () {
  'use strict';

  var x = angular.module('app.auth', ['firebase']);

  x.factory("Auth", ["$firebaseAuth",
    function ($firebaseAuth) {
      var rootUrl = "https://glowing-heat-6414.firebaseio.com/";
      var reference_FirebaseRoot = new Firebase(rootUrl);
      return $firebaseAuth(reference_FirebaseRoot);
    }]);

  x.controller("SampleCtrl", ["$scope", "Auth",
    function ($scope, Auth) {
      $scope.auth = Auth;

      // any time auth status updates, add the user data to scope
      $scope.auth.$onAuth(function (authData) {
        $scope.authData = authData;
      });
    }
  ]);

})();
