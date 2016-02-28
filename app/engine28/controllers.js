(function () {
  'use strict';

  angular
    .module('app.engine28')
    .controller('engine28Controller', engine28Controller);

  engine28Controller.$inject = [
    '$scope',
    '$location',
    '$http',
    '$firebase',
    '$firebaseObject',
    '$firebaseArray',
    '$firebaseAuth',
    'Auth',
    '$routeParams',
    'currentAuth'
  ];


  function engine28Controller($scope,
                              $location,
                              $http,
                              $firebase,
                              $firebaseObject,
                              $firebaseArray,
                              $firebaseAuth,
                              Auth,
                              $routeParams,
                              currentAuth) {

    var createDaysForChain = function (date) {
      var arr = [],
        i;
      for (i = 0; i < 28; i++) {
        //arr[i] = { // chain array is indexed from 0 to 27
        arr[moment(date).add(i, 'days').format("YYYY-MM-DD")] = { // chain array is indexed by a day's respective date
          status: "ny",
          date: moment(date).add(i, 'days').format("YYYY-MM-DD"),
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

    var origAttemptDate ;

    // cleaned
    $scope.oldDateValue;
    $scope.getAttemptData = function () {
      // get the Attempt data. To get the exact 28 days of the Chain to be shown,
      // I use a separate proceure (below)
      var url_attempt = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
      var refFbase_attempt = new Firebase(url_attempt);
      var syncObjectAttempt = $firebaseObject(refFbase_attempt);
      syncObjectAttempt.$bindTo($scope, "attempt");

      // Retrieve only the name of the Attempt's Habit, b/c that's the only aspect
      // of the Habit I need to show on the page.
      var url_Habit = reference_FirebaseRoot + "habits/" + currentAuth.uid + "/" + $routeParams.idhabit;
      var refFbase_habit = new Firebase(url_Habit);
      var syncObjectHabit = $firebaseObject(refFbase_habit);
      syncObjectHabit.$bindTo($scope, "habitName");

      // Get the exact 28 days of the Chain to be shown,
      var urlAttemptStartDate = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt + "/startDate/";
      var refFbase_AttemptStartDate = new Firebase(urlAttemptStartDate);
      var startDate;
      refFbase_AttemptStartDate.on("value", function(snapshot) {
        //console.log("startDate " + snapshot.val());
        startDate = snapshot.val();
        var endDate = moment(startDate).add(27, 'd').format('YYYY-MM-DD');
        //console.log("endDate " + endDate);
        // get the entire Attempt's chain. This code is in a callback func because it would run before the retrieval of startDate
        // The entire chain might have more than 28 Days, because the user might have changed the startDate.
        var urlEntireChain = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt + "/chain/";
        var refFbase_chain = new Firebase(urlEntireChain);
        // query the start date and the following 27
        //refFbase_chain.orderByChild('date').startAt(startDate).endAt(moment(startDate, 'YYYY-MM-DD').add(27, 'days')).on("child_added", function(snapshot) {
        var query = refFbase_chain.orderByChild('date').startAt(startDate).endAt(endDate);

        $scope.data = $firebaseArray(query);

      });



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
      console.log();

      var url_Habit = reference_FirebaseRoot + "habits/" + currentAuth.uid + "/" + $routeParams.id;
      var refFbase_habit = new Firebase(url_Habit);
      var syncObjectHabit = $firebaseObject(refFbase_habit);
      syncObjectHabit.$bindTo($scope, "habitName");


      $scope.showLoading = false;
    };

    $scope.oldDateValue;
    $scope.storeOldStartDate = function(oldStartDate) {
      console.log("oldStartDate " + oldStartDate);
      $scope.oldDateValue = oldStartDate;
    }

    $scope.changeChainDates = function (chain, oldDate, newDate) {
      var newDate = window.prompt("Please enter the new date.\nPlease use the format listed below.\nPlease don't click the Cancel button.", newDate);
      console.log("chain " + chain);
      console.log("oldDate " + oldDate);
      console.log("newDate " + newDate);
      var duration = moment.duration(moment(newDate).diff(moment(oldDate)));
      var difference = duration.asDays();
      console.log("day difference " + difference);

      var urlAttemptStartDate = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
      var refFbase_AttemptStartDate = new Firebase(urlAttemptStartDate);
      refFbase_AttemptStartDate.update({
        startDate: newDate

      });


      // STRATEGY take the offset, the difference in numb of days (a positive or negative integer) from the old
      // date and the new date. then apply that change to each day's date in the chain

      var url = "https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
      var attemptData = new Firebase(url);
      //alert(attemptData)
      //for (var i = 0; i < chain.length; i++) {
      for (var i = 0; i < 28; i++) {
        //console.log(data[i].date);
        attemptData.child("chain").child( moment(oldDate).add(i + difference, 'days').format('YYYY-MM-DD') ).update({
          //date: moment().format()
          //date: data[i].date
          date: moment(oldDate).add(i + difference, 'days').format('YYYY-MM-DD')
        });
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
        attempts: [attemptPush.key()],
        id: habitPush.key()
      });

      attemptsRef.child(attemptPush.key()).update({
        id: attemptPush.key()
      });

      /*      habitsRef.$add({ foo: "bar" }).then(function(ref) {
       var id = ref.key();
       console.log("added record with id " + id);
       habitsRef.$indexFor(id); // returns location in the array
       });*/

      window.location = "/#/attempt/" + habitPush.key() + "/" + attemptPush.key();


    };

    $scope.addAttempt = function () {
      console.log("Attempting to add a new Attempt to Habit " + $routeParams.id);
      // add Attempt to Firebase/attempts/
      var attemptsRef = reference_FirebaseRoot.child("attempts/" + $routeParams.id);

      var attemptPush = attemptsRef.push({
        uid: $scope.authData.uid,
        id_habit: $routeParams.id,
        name: "Attempt for Habit: " + "HABIT NAME",
        habitName: "HABIT NAME",
        description: "Write a description about this attempt...",
        chain: createDaysForChain(moment().format('YYYY-MM-DD')),
        startDate: moment().format('YYYY-MM-DD')
      });

      // add Attemt's ID to Habit's Attempt array
      var refFbase_attemptsArray = reference_FirebaseRoot.child("habits/" + currentAuth.uid + "/" + $routeParams.id + "/attempts");
      refFbase_attemptsArray.push(
        attemptPush.key()
      );


    };


    $scope.updateHabit = function () {

      var url = reference_FirebaseRoot + "attempts/" + $scope.book.id + "/" + $scope.book.id_attempt;
      var attemptData = new Firebase(url);
      var syncobject = $firebaseObject(attemptData);
      syncobject.$bindTo($scope, "attemptData");
      console.log("syncobject1 " + syncobject);
      //$scope.dog = "woof";
      //alert(attemptData);
      var url2 = reference_FirebaseRoot + "habits/" + masterId + "/" + $scope.book.id + "/name";
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
      //var attemptToDelete = reference_FirebaseRoot.child("attempts/" + $scope.book.id + "/" + $scope.book.id_attempt);

      var attemptsToDelete = reference_FirebaseRoot.child("attempts/" + $scope.book.id);
      attemptsToDelete.remove();
      // TODO when Habits are able to have multiple Attempts, write code to delete all Habit's Attempts
    };
  }


}());