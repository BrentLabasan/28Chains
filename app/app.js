'use strict';
/* App Module */

var app = angular
  .module('TwentyEightChains', [
    // Angular modules.
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    // Third party modules.
    'firebase',
    'anguvideo',
    'angularBootstrap',
    // 28Chain modules.
    'app.attemptViewer',
    'app.auth',
    'app.core',
    'app.engine28',
    'app.layout'
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
      controller: 'engine28Controller',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .when('/createHabit', {
      templateUrl: 'partials/createHabit.html',
      controller: 'engine28Controller',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .when('/updateHabit', {
      templateUrl: 'partials/updateHabit.html',
      controller: 'engine28Controller',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .when('/deleteHabit', {
      templateUrl: 'partials/deleteHabit.html',
      controller: 'engine28Controller',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .when('/habit/:id', {
      templateUrl: 'partials/habit.html',
      controller: 'engine28Controller',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .when('/attempt/:idhabit/:idattempt', {
      templateUrl: 'partials/attempt.html',
      controller: 'engine28Controller',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
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
app.run(['$http', "$rootScope", "$location", function ($http, $rootScope, $location) {

  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/home");
    }
  });


  // Predefine the API's value from Parse.com
  $http.defaults.headers.common = {
    'X-Parse-Application-Id': 'WkRZPQr0whIqwm3fom8zNAmjqfJFqPmZVeFW5sFD',
    'X-Parse-REST-API-Key': 'FszCMz7KIEeHjYUy3mbSA4iZPUZ3wZnwRnFa3nvd'
  }


}]);
