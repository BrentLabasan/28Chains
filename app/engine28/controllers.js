(function () {
  'use strict';

  angular
    .module('app.engine28')
    .controller('engine28Controller', engine28Controller);

  engine28Controller.$inject = [
    '$scope',
    '$location',
    '$http',
    '$firebaseObject',
    '$firebaseArray',
    '$firebaseAuth',
    'Auth',
    '$routeParams',
    'currentAuth'
  ];


  function engine28Controller(
   $scope,
   $location,
   $http,
   $firebaseObject,
   $firebaseArray,
   $firebaseAuth,
   Auth,
   $routeParams,
   currentAuth
  )
  {

    var createDaysForChain = function (date) {
      var arr = [],
        i;
      for (i = 0; i < 28; i++) {
        arr[i] = {
          status: "ny",
          date: moment(date).add(i, 'days').format(),
          YouTube: ""
        };
      }
      return arr;
    };

    $scope.routeParams = $routeParams;

    // https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html

    $scope.auth = Auth;
    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function (authData) {
      console.log("$scope.auth.$onAuth in engine28/controller.js");
      // any time auth status updates, add the user data to scope
      $scope.authData = authData;
      $scope.getAllHabits();
    });


    $scope.showLoading = true;

    // cleaned
    $scope.getAttemptData = function () {
      var url_attempt = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
      var refFbase_attempt = new Firebase(url_attempt);
      var syncObjectAttempt = $firebaseObject(refFbase_attempt);
      syncObjectAttempt.$bindTo($scope, "data");

      var url_Habit = reference_FirebaseRoot + "habits/" + currentAuth.uid + "/" + $routeParams.idhabit ;
      var refFbase_habit = new Firebase(url_Habit);
      var syncObjectHabit = $firebaseObject(refFbase_habit);
      syncObjectHabit.$bindTo($scope, "habitName");

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

    // cleaned
    $scope.getHabitsAttempts = function () {
      var refFbase_attempt = new Firebase("https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.id);
      var syncObject = $firebaseObject(refFbase_attempt);
      syncObject.$bindTo($scope, "data");
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

    // cleaned
    $scope.getAllHabits = function () {
      //console.log(currentAuth);
      //console.log(currentAuth.uid);
      var allUsersHabits = reference_FirebaseRoot.child("habits/" + currentAuth.uid);
      //console.log(allUsersHabits);
      var syncObject = $firebaseObject(allUsersHabits);
      syncObject.$bindTo($scope, "books");
      $scope.showLoading = false;
    };


    $scope.addHabit = function () {
      // create the Habit
      var habitsRef = reference_FirebaseRoot.child("habits/" + $scope.authData.uid);
      var habitPush = habitsRef.push({
        uid: $scope.authData.uid,
        //id_attempt: attemptPush.key(),
        name: $scope.book.name,
        description: $scope.book.description
      });

      console.log("document.getElementById('startDate').value " + document.getElementById("startDate").value);
      // create the Attempt
      var attemptsRef = reference_FirebaseRoot.child("attempts/" + habitPush.key());
      var attemptPush = attemptsRef.push({
        uid: $scope.authData.uid,
        id_habit: habitPush.key(),
        name: "Attempt for Habit: " + $scope.book.name,
        habitName: $scope.book.name,
        description: "Write a description about this attempt...",
        chain: createDaysForChain(document.getElementById("startDate").value),
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


    };


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

    //cleaned
    $scope.destroyHabit = function () {
      var habitToDelete = reference_FirebaseRoot.child("habits/" + $scope.authData.uid + "/" + $scope.book.id);
      habitToDelete.remove(); // Habit is deleted from Firebase
      // the lone Attempt of the Habit that was just deleted is also deleted
      var attemptToDelete = reference_FirebaseRoot.child("attempts/" + $scope.book.id + "/" + $scope.book.id_attempt);
      attemptToDelete.remove();
      // TODO when Habits are able to have multiple Attempts, write code to delete all Habit's Attempts
    };
  }


}());