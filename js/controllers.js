(function () {
  "use strict";

  /* Controllers */

  var twentyEightChainsControllers = angular.module('twentyEightChainsControllers',
    ['firebase', 'ui.bootstrap.demo', 'ngSanitize']);

  /*******************************************************************************
   *******************************************************************************
   * # CoreController:
   * - for showAllBooks, addHabit, updateHabit and destroyHabit.
   *
   * @param  {Object} $scope      [glue between view/model and controller]
   * @param  {Object} $location   [control the url]
   * @param  {Object} $http       [get connection with parse.com using REST Api]
   ******************************************************************************/
  twentyEightChainsControllers.controller('CoreController',
    ['$scope', '$location', '$http', '$firebaseObject', '$firebaseArray', '$firebaseAuth', 'Auth', '$routeParams',
      function ($scope, $location, $http, $firebaseObject, $firebaseArray, $firebaseAuth, Auth, $routeParams) {

        var rootUrl = "https://glowing-heat-6414.firebaseio.com/";
        var reference2Root = new Firebase(rootUrl);

        $scope.routeParams = $routeParams;

        // https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html
        $scope.auth = Auth;
        $scope.authData = null;

        // any time auth status updates, add the user data to scope
        $scope.auth.$onAuth(function (authData) {
          $scope.authData = authData;
          console.log("$scope.authData loaded in CoreController:", $scope.authData);
          masterId = $scope.authData.uid;
          console.log("masterId2 " + masterId);

          $scope.getAllHabits();
        });


        /**
         * ## showLoading
         * once the page is loaded, only show progressbar, which will be hidden after
         * loaded all data, and the rest content of this page will be shown;
         */
        $scope.showLoading = true;

        $scope.getAttemptData = function () {
          var url = "https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
          var attemptData = new Firebase(url);
          var syncobject = $firebaseObject(attemptData);
          syncobject.$bindTo($scope, "data");
          console.log("syncobject1 " + syncobject);
          //$scope.dog = "woof";
          //alert(attemptData);
          var url2 = "https://glowing-heat-6414.firebaseio.com/habits/" + masterId + "/" + $routeParams.idhabit + "/name";
          var habitName3 = new Firebase(url2);
          var syncobject2 = $firebaseObject(habitName3);
          syncobject2.$bindTo($scope, "habitName");

          //                $scope.books = $firebaseObject(ref.child('habits').child(masterId));
          $scope.showLoading = false;


        };

        $scope.getTabHeading = function (index, dateOfTab) {
          var s = "" + (index + 1);
          //console.log( moment(dateOfTab).format("MM-DD-YYYY") + "-----" + moment().format("MM-DD-YYYY") );
          if (moment(dateOfTab).format("MM-DD-YYYY") === moment().format("MM-DD-YYYY")) {
            s += "<span class='glyphicon glyphicon-flash animate-flicker' ></span>";
          }
          //console.log("s " + s);
          return s;
        };

        $scope.getHabitsAttempts = function () {

          $scope.woof = "woof1";
          $scope.id_habit = $routeParams.id;
          var ref3 = new Firebase("https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.id);
          //.equalTo($routeParams.id, "id_habit")
          //.equalTo($routeParams.id)

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
          $scope.showLoading = false;


        };

        $scope.changeChainDates = function (data, blah) {
          //alert(data);
          //console.log("blah " + blah);
          var url = "https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
          var attemptData = new Firebase(url);
          //alert(attemptData)
          for (i = 0; i < data.length; i++) {
            //console.log(data[i].date);
            attemptData.child("chain").child(i).update({
              //date: moment().format()
              //date: data[i].date
              date: moment(blah).add(i, 'days').format()
            });

            // = moment(data[i].date).add(i, 'days').format();
            //data[i].date = moment(data[i].date).add(i, 'days').format();
            // console.log(data[i]);
          }
        };

        /*      $scope.getStartDateOfAttempt = function(book_id, book_id_attempt) {
         var ref10 = new Firebase("https://glowing-heat-6414.firebaseio.com/");
         var attemptRef = ref10.child(book_id).child(book_id_attempt);
         return "9/9/1999";
         //return attemptRef.startDate;
         };*/

        /**
         * ## getAllHabits
         * sent a GET request to parse.com once the controller is loaded. If the
         * request is succeed, all books stored in parse.com will be loaded and
         * saved to an array $scope.books; otherwise, show error messages in console.
         */
        $scope.getAllHabits = function () {
          console.log("GET ALL BOOKS 1")
          //console.log(authData); // !! I THINK IT'S BECAUSE AUTHDATA NOT DEFINED AT THIS POINT

          /*            var ref2 = new Firebase("https://glowing-heat-6414.firebaseio.com/");
           ref2.on("value", function(snapshot){
           console.log("--- masterId in getAllBookss " + masterId);
           $scope.books = $firebaseObject(ref.child('habits').child(masterId));

           $scope.showLoading = false;
           console.log("GET ALL BOOKS 2")

           });*/

          var url2 = "https://glowing-heat-6414.firebaseio.com/habits/" + masterId;
          console.log(url2)
          var habitName3 = new Firebase(url2);
          var syncobject2 = $firebaseObject(habitName3);
          syncobject2.$bindTo($scope, "books");

          console.log("GET ALL BOOKS 3")
          $scope.showLoading = false;

        };


        var createDay = function (date) {

          var arr = [];
          var i;
          for (i = 0; i < 28; i++) {
            arr[i] = {
              status: "ny",
              date: moment(date).add(i, 'days').format(),
              YouTube: ""
            }
          }
          return arr;
        };

        /**
         * ## addHabit
         * send a POST request to parse.com for inserting a new book record which
         * stored in $scope.book to parse.com. If the request is succeed, clear all
         * the temporary data and jump to parent page; otherwise, show error messages
         * in console.
         */

        $scope.addHabit = function () {
          var ref = new Firebase(rootUrl);

          // create the Habit
          var habitsRef = ref.child("habits/" + $scope.authData.uid);
          var habitPush = habitsRef.push({
            uid: $scope.authData.uid,
            //id_attempt: attemptPush.key(),
            name: $scope.book.name,
            description: $scope.book.description
          });

          console.log("document.getElementById('startDate').value " + document.getElementById("startDate").value);
          // create the Attempt
          var attemptsRef = ref.child("attempts/" + habitPush.key());
          var attemptPush = attemptsRef.push({
            uid: $scope.authData.uid,
            id_habit: habitPush.key(),
            name: "Attempt for Habit: " + $scope.book.name,
            habitName: $scope.book.name,
            description: "Write a description about this attempt...",
            chain: createDay(document.getElementById("startDate").value),
            startDate: document.getElementById("startDate").value

          });

          habitsRef.child(habitPush.key()).update({
            id_attempt: attemptPush.key(),
            id: habitPush.key()
          });

          attemptsRef.child(attemptPush.key()).update({
            id: attemptPush.key()
          });

          window.location = "/#/attempt/" + habitPush.key() + "/" + attemptPush.key();


          /*

           attemptsRef.child(attemptPush.key()).update({
           id_habit: habitPush.key(),
           });

           */

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
         * ## updateHabit
         * send a PUT request to parse.com for changing book record, which has a
         * standard objectId defined by parse.com itself and stored in $scope.book,
         * to parse.com. If the request is succeed, clear all the temporary data and
         * jump to parent page; otherwise, show error messages in console.
         */
        $scope.updateHabit = function () {

          var url = "https://glowing-heat-6414.firebaseio.com/attempts/" + $scope.book.id + "/" + $scope.book.id_attempt;
          var attemptData = new Firebase(url);
          var syncobject = $firebaseObject(attemptData);
          syncobject.$bindTo($scope, "attemptData");
          console.log("syncobject1 " + syncobject);
          //$scope.dog = "woof";
          //alert(attemptData);
          var url2 = "https://glowing-heat-6414.firebaseio.com/habits/" + masterId + "/" + $scope.book.id + "/name";
          var habitName3 = new Firebase(url2);
          var syncobject2 = $firebaseObject(habitName3);
          syncobject2.$bindTo($scope, "habitData");

          //                $scope.books = $firebaseObject(ref.child('habits').child(masterId));
          $scope.showLoading = false;

          /*          var ref7 = new Firebase(rootUrl);

           // update the Habit
           var habitsRef = ref7.child("habits/" + $scope.authData.uid);
           var habitPush = habitsRef.update({
           //id_attempt: attemptPush.key(),
           name: $scope.book.name,
           description: $scope.book.description
           });

           var changeChain = function() {
           for(var i =0; i<28; i++) {

           }
           }

           console.log("document.getElementById('startDate').value " + document.getElementById("startDate").value);
           // create the Attempt
           var attemptsRef = ref7.child("attempts/" + $scope.book.id + "/" + $scope.book.id_attempt);
           var attemptPush = attemptsRef.update({
           startDate: document.getElementById("startDate").value
           });*/

          window.location = "/#/attempt/" + $scope.book.id + "/" + $scope.book.id_attempt;

        };

        /**
         * ## destroyHabit
         * send a DELETE request to parse.com for deleting a book record which has
         * a standard objectId defined by parse.com itself. If the request is succeed,
         * jump to parent page; otherwise, show error messages in console.
         */
        $scope.destroyHabit = function () {
          // delete the Habit
          console.log("$scope.book.id " + $scope.book.id);
          // delete the Habit
          var habitToDelete = reference2Root.child("habits/" + $scope.authData.uid + "/" + $scope.book.id);
          habitToDelete.remove();
          // delete it's Attempt
          var attemptToDelete = reference2Root.child("attempts/" + $scope.book.id + "/" + $scope.book.id_attempt);
          attemptToDelete.remove();

          /*            var bookUrl = 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId;
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
           });*/
        };


      }]);


  /*==============================================================================
   *==============================================================================
   * # TestDatasController
   * - for creating and clearing test data.
   ******************************************************************************/
  twentyEightChainsControllers.controller('TestDatasController',
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


}());