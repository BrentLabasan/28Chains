(function () {
  'use strict';

  var x = angular.module('app.auth', []);

  function AuthController($location, authService) {
    var rootUrl = "https://glowing-heat-6414.firebaseio.com/",
      reference_FirebaseRoot = new Firebase(rootUrl);

    app.factory("Auth", ["$firebaseAuth",
      function ($firebaseAuth) {
        return $firebaseAuth(reference_FirebaseRoot);
      }]);
  }

  x.controller('AuthController', AuthController);


})();
