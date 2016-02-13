/* Controllers */

var publicLibraryControllers = angular.module('publicLibraryControllers', ['firebase', 'ui.bootstrap.demo']);


/*******************************************************************************
 *******************************************************************************
 * # BooksController:
 * - for showAllBooks, addBook, updateBook and destroyBook.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} $http       [get connection with parse.com using REST Api]
 ******************************************************************************/
publicLibraryControllers.controller('BooksController',
    ['$scope', '$location', '$http', '$firebaseObject', '$firebaseArray', '$firebaseAuth', 'Auth', '$routeParams', function ($scope, $location, $http, $firebaseObject, $firebaseArray, $firebaseAuth, Auth, $routeParams) {

        $scope.meow = "meow1";

        var rootUrl = "https://glowing-heat-6414.firebaseio.com";
        var ref = new Firebase(rootUrl);
        var auth = $firebaseAuth(ref);

        console.log("$routeParams " + $routeParams.id);
        $scope.routeParams = $routeParams;

        // https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html
        $scope.auth = Auth;
        // any time auth status updates, add the user data to scope
        $scope.auth.$onAuth(function (authData) {
            $scope.authData = authData;
            console.log("authData loaded in BooksController:", authData);
        });

        /**
         * ## showLoading
         * once the page is loaded, only show progressbar, which will be hidden after
         * loaded all data, and the rest content of this page will be shown;
         */
        $scope.showLoading = true;

        $scope.getAttemptData = function() {
            var url = "https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
            var attemptData = new Firebase(url);
            var syncobject = $firebaseObject(attemptData);
            syncobject.$bindTo($scope, "data");
            console.log("syncobject " + syncobject);
            $scope.dog = "woof";

        };

        $scope.getHabitsAttempts = function() {
            $scope.woof = "woof1";
            $scope.id_habit = $routeParams.id;
            var ref3 = new Firebase("https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.id)
                //.equalTo($routeParams.id, "id_habit")
                //.equalTo($routeParams.id)
                ;
            var syncobject = $firebaseObject(ref3);
            syncobject.$bindTo($scope, "data");
            console.log("syncobject " + syncobject);

            //console.log("ref3 " + ref3);
            //console.log("$scope.blah " + $scope.blah)
/*
            ref3.on("value", function(snapshot){
                $scope.HabitsAttempts = $firebaseObject(ref3);
                console.log("$scope.HabitsAttempts " + $firebaseObject(ref3));
                //$scope.showLoading = false;
            });*/


        };

        /**
         * ## getAllBooks
         * sent a GET request to parse.com once the controller is loaded. If the
         * request is succeed, all books stored in parse.com will be loaded and
         * saved to an array $scope.books; otherwise, show error messages in console.
         */
        $scope.getAllBooks = function () {

            var ref2 = new Firebase("https://glowing-heat-6414.firebaseio.com");
            ref2.on("value", function(snapshot){
                $scope.books = $firebaseObject(ref.child('habits').child($scope.authData.facebook.id));
                console.log($scope.books);
                $scope.showLoading = false;
            });


            /*
             $http({
             method: 'GET',
             url: 'https://api.parse.com/1/classes/Book'
             })
             .success( function ( data) {
             $scope.showLoading = false;
             $scope.books = data.results;
             })
             .error( function ( data) {
             console.log( data);
             alert("OH! Can NOT get all books, see the information in console.");
             });*/

        };

        /**
         * ## addBook
         * send a POST request to parse.com for inserting a new book record which
         * stored in $scope.book to parse.com. If the request is succeed, clear all
         * the temporary data and jump to parent page; otherwise, show error messages
         * in console.
         */

        var createDay = function () {
            var arr = [];
            var i;
            for (i = 0; i < 28; i++) {
                arr[i] = {
                    status: "n"
                }
            }
            return arr;
        }

        $scope.addBook = function () {
            var rootUrl = "https://glowing-heat-6414.firebaseio.com";
            var ref = new Firebase(rootUrl);

            var habitsRef = ref.child("habits/" + $scope.authData.facebook.id);
            var habitPush = habitsRef.push({
                id_user: $scope.authData.facebook.id,
                //id_attempt: attemptPush.key(),
                name: $scope.book.name,
                description: $scope.book.description
            });

            var attemptsRef = ref.child("attempts/" +habitPush.key());
            var attemptPush = attemptsRef.push({
                id_user: $scope.authData.facebook.id,
                id_habit: habitPush.key(),
                name: "Attempt for Habit" + $scope.book.name,
                description: "Write a description about this attempt...",
                chain: createDay()

            });

            habitsRef.child(habitPush.key()).update({
                id_attempt: attemptPush.key(),
            });


            /*    $http({
             method: 'POST',
             url: 'https://api.parse.com/1/classes/Book',
             data: {
             isbn: $scope.book.isbn,
             title: $scope.book.title,
             year: $scope.book.year
             }
             })
             .success( function () { $location.path('/');})
             .error( function ( data) {
             console.log( data);
             alert("OH! Book is NOT added, see the information in console.");
             });*/

        };

        /**
         * ## updateBook
         * send a PUT request to parse.com for changing book record, which has a
         * standard objectId defined by parse.com itself and stored in $scope.book,
         * to parse.com. If the request is succeed, clear all the temporary data and
         * jump to parent page; otherwise, show error messages in console.
         */
        $scope.updateBook = function () {
            var bookUrl = 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId;
            $http({
                method: 'PUT',
                url: bookUrl,
                data: {
                    isbn: $scope.book.isbn,
                    title: $scope.book.title,
                    year: $scope.book.year
                }
            })
                .success(function () {
                    $location.path('/');
                })
                .error(function (data) {
                    console.log(data);
                    alert("OH! Book is NOT updated, see the information in console.");
                });
        };

        /**
         * ## destroyBook
         * send a DELETE request to parse.com for deleting a book record which has
         * a standard objectId defined by parse.com itself. If the request is succeed,
         * jump to parent page; otherwise, show error messages in console.
         */
        $scope.destroyBook = function () {
            var bookUrl = 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId;
            $http({
                method: 'DELETE',
                url: bookUrl
            })
                .success(function () {
                    $location.path('/');
                })
                .error(function (data) {
                    console.log(data);
                    alert("Book is NOT deleted. See the error message in console.");
                });
        };


    }]);


/*==============================================================================
 *==============================================================================
 * # TestDatasController
 * - for creating and clearing test data.
 ******************************************************************************/
publicLibraryControllers.controller('TestDatasController',
    ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        // Create test data.
        $scope.createTestData = function () {
            $scope.clearDatabase();
            $timeout(function () {
                // basic data from author, publisher and book
                $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/batch',
                    data: {
                        requests: [
                            // Create Test Data for Books
                            {
                                method: 'POST',
                                path: '/1/classes/Book',
                                body: {
                                    isbn: "0553345842",
                                    title: "The Mind's I",
                                    year: 1982
                                }
                            },
                            {
                                method: 'POST',
                                path: '/1/classes/Book',
                                body: {
                                    isbn: "1463794762",
                                    title: "The Critique of Pure Reason",
                                    year: 2011
                                }
                            },
                            {
                                method: 'POST',
                                path: '/1/classes/Book',
                                body: {
                                    isbn: "1928565379",
                                    title: "The Critique of Practical Reason",
                                    year: 2009
                                }
                            },
                            {
                                method: 'POST',
                                path: '/1/classes/Book',
                                body: {
                                    isbn: "0465030793",
                                    title: "I Am A Strange Loop",
                                    year: 2000
                                }
                            }
                        ]
                    }
                })
                    .success(function () {
                        console.log("added 4 books");
                    })
                    .error(function (data) {
                        console.log(data);
                        alert("OH! Something goes wrong. See the information in console.");
                    });
            }, 2000);
        };

        // Clear all test data.
        $scope.clearDatabase = function () {
            // Clear all Book Data
            $http({
                method: 'GET',
                url: 'https://api.parse.com/1/classes/Book'
            })
                .success(function (data) {
                    var obs = data.results;
                    obs.forEach(function (ob) {
                        $http({
                            method: 'DELETE',
                            url: 'https://api.parse.com/1/classes/Book/' + ob.objectId
                        })
                            .error(function (data, status, headers, config) {
                                alert("OH! Something goes wrong. See the information in console.");
                                console.log(data, status, headers, config);
                            });
                    });
                    console.log("clear all book data.");
                })
                .error(function (data, status, headers, config) {
                    alert("OH! Something goes wrong. See the information in console.");
                    console.log(data, status, headers, config);
                });
        };
    }]);
