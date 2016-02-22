(function () {
  'use strict';

  var x = angular.module('app.header', []);

  function HeaderController($scope, $firebaseObject, $firebaseArray, $firebaseAuth, Auth) {
    // https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html
    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function (authData) {
      $scope.authData = authData;
      console.log("authData loaded in HeaderController:", authData);
      //masterId = $scope.authData.uid;
      //console.log("masterId1 " + masterId);
    });
  }

  x.controller('HeaderController', HeaderController);


})();
