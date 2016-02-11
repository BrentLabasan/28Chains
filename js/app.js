
/* App Module */

var publicLibraryApp = angular.module( 'publicLibraryApp',
['ngRoute', 'publicLibraryControllers']);

/**
 * Configuration Block
 */
publicLibraryApp.config( [ '$routeProvider', function ( $routeProvider){
  $routeProvider
  // Router configuration
    .when( '/main', {
      templateUrl: 'partials/main.html',
      controller: 'TestDatasController'
     })
    .when( '/showAllBooks', {
      templateUrl: 'partials/showAllBooks.html',
      controller: 'BooksController'
    })
    .when( '/createBook', {
      templateUrl: 'partials/createBook.html',
      controller: 'BooksController'
    })
    .when( '/updateBook', {
      templateUrl: 'partials/updateBook.html',
      controller: 'BooksController'
    })
    .when( '/deleteBook', {
      templateUrl: 'partials/deleteBook.html',
      controller: 'BooksController'
    })
    .otherwise( {
      redirectTo: '/main'
  });
}]);

/**
 * Run Block
 */
publicLibraryApp.run( [ '$http', function ( $http) {
  // Predefine the API's value from Parse.com
  $http.defaults.headers.common = {
    'X-Parse-Application-Id': 'WkRZPQr0whIqwm3fom8zNAmjqfJFqPmZVeFW5sFD',
    'X-Parse-REST-API-Key': 'FszCMz7KIEeHjYUy3mbSA4iZPUZ3wZnwRnFa3nvd'
  }
}]);
