'use strict';
/* App Module */

var app = angular
  .module('TwentyEightChains', [
    // Angular modules.
    'ngRoute',
    'ngAnimate',
    // Third party modules.
    'firebase',
    'anguvideo',
    // 28Chain modules.
    'app.auth',
    'app.core',
    'twentyEightChainsControllers'
  ]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  // Router configuration
    .when('/main', {
      templateUrl: 'partials/main.html',
      controller: 'TestDatasController'
    })
    .when('/showAllHabits', {
      templateUrl: 'partials/showAllHabits.html',
      controller: 'CoreController'
    })
    .when('/createHabit', {
      templateUrl: 'partials/createHabit.html',
      controller: 'CoreController'
    })
    .when('/updateHabit', {
      templateUrl: 'partials/updateHabit.html',
      controller: 'CoreController'
    })
    .when('/deleteHabit', {
      templateUrl: 'partials/deleteHabit.html',
      controller: 'CoreController'
    })
    .when('/habit/:id', {
      templateUrl: 'partials/habit.html',
      controller: 'CoreController'
    })
    .when('/attempt/:idhabit/:idattempt', {
      templateUrl: 'partials/attempt.html',
      controller: 'CoreController'
    })
    .otherwise({
      redirectTo: '/showAllHabits'
    });
}]);

var masterId;

var rootUrl = "https://glowing-heat-6414.firebaseio.com/",
  reference_FirebaseRoot = new Firebase(rootUrl);

app.factory("Auth", ["$firebaseAuth",
  function ($firebaseAuth) {
    return $firebaseAuth(reference_FirebaseRoot);
  }]);

app.controller('HeaderController', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', 'Auth',
  //function ($scope, $firebaseObject, $firebaseArray, $firebaseAuth, Auth, $routeParams) {
  function ($scope, $firebaseObject, $firebaseArray, $firebaseAuth, Auth) {
    // https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html
    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function (authData) {
      $scope.authData = authData;
      console.log("authData loaded in HeaderController:", authData);
      masterId = $scope.authData.uid;
      console.log("masterId1 " + masterId);
    });
  }
]);


/**
 * Run Block
 */
app.run(['$http', function ($http) {
  // Predefine the API's value from Parse.com
  $http.defaults.headers.common = {
    'X-Parse-Application-Id': 'WkRZPQr0whIqwm3fom8zNAmjqfJFqPmZVeFW5sFD',
    'X-Parse-REST-API-Key': 'FszCMz7KIEeHjYUy3mbSA4iZPUZ3wZnwRnFa3nvd'
  }
}]);
