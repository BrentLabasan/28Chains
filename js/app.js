
/* App Module */

var app = angular.module( 'TwentyEightChains', ['ngRoute', 'publicLibraryControllers', 'firebase', 'ngAnimate']);
var masterId ;
app.factory("Auth", ["$firebaseAuth",
    function ($firebaseAuth) {
        var ref = new Firebase("https://glowing-heat-6414.firebaseio.com", "example3");
        return $firebaseAuth(ref);
    }
]);

app.controller('HeaderController', ['$scope', '$firebaseObject','$firebaseArray', '$firebaseAuth', 'Auth',
    function($scope, $firebaseObject, $firebaseArray, $firebaseAuth, Auth, $routeParams) {
        $scope.meow = "a";

        var rootUrl = "https://glowing-heat-6414.firebaseio.com";
        var ref = new Firebase(rootUrl);
        var auth = $firebaseAuth(ref);

        // https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html
        $scope.auth = Auth;
        //console.log("$scope.auth " + $scope.auth);
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
 * Configuration Block
 */
app.config( [ '$routeProvider', function ($routeProvider){


  $routeProvider
  // Router configuration
    .when( '/main', {
      templateUrl: 'partials/main.html',
      controller: 'TestDatasController'
     })
    .when( '/showAllHabits', {
      templateUrl: 'partials/showAllHabits.html',
      controller: 'BooksController'
    })
    .when( '/createHabit', {
      templateUrl: 'partials/createHabit.html',
      controller: 'BooksController'
    })
    .when( '/updateHabit', {
      templateUrl: 'partials/updateHabit.html',
      controller: 'BooksController'
    })
    .when( '/deleteHabit', {
      templateUrl: 'partials/deleteHabit.html',
      controller: 'BooksController'
    })
    .when( '/habit/:id', {
      templateUrl: 'partials/habit.html',
      controller: 'BooksController'
    })
    .when( '/attempt/:idhabit/:idattempt', {
      templateUrl: 'partials/attempt.html',
      controller: 'BooksController'
    })
    .otherwise( {
      redirectTo: '/showAllHabits'
  });
}]);

/**
 * Run Block
 */
app.run( [ '$http', function ($http) {
  // Predefine the API's value from Parse.com
  $http.defaults.headers.common = {
    'X-Parse-Application-Id': 'WkRZPQr0whIqwm3fom8zNAmjqfJFqPmZVeFW5sFD',
    'X-Parse-REST-API-Key': 'FszCMz7KIEeHjYUy3mbSA4iZPUZ3wZnwRnFa3nvd'
  }
}]);
