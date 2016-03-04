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

    $scope.showLoadingBar = function () {
      return $scope.showLoading && currentAuth;
    }

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
      if (currentAuth) {
        $scope.getAllHabits();
      }
    });


    $scope.showLoading = true;

    var origAttemptDate;


    // cleaned
    $scope.oldDateValue;
    $scope.getAttemptData = function () {
      // get the Attempt data. To get the exact 28 days of the Chain to be shown,
      // I use a separate proceure (below)
      var url_attempt = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
      var refFbase_attempt = new Firebase(url_attempt);
      var syncObjectAttempt = $firebaseObject(refFbase_attempt);
      syncObjectAttempt.$bindTo($scope, "attempt");

      if (currentAuth) {
        // Retrieve only the name of the Attempt's Habit, b/c that's the only aspect
        // of the Habit I need to show on the page.
        var url_Habit = reference_FirebaseRoot + "habits/" + currentAuth.uid + "/" + $routeParams.idhabit;
        var refFbase_habit = new Firebase(url_Habit);
        var syncObjectHabit = $firebaseObject(refFbase_habit);
        syncObjectHabit.$bindTo($scope, "habitName");
      }


      // Get the exact 28 days of the Chain to be shown,
      var urlAttemptStartDate = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt + "/startDate/";
      var refFbase_AttemptStartDate = new Firebase(urlAttemptStartDate);
      var startDate;
      refFbase_AttemptStartDate.on("value", function (snapshot) {
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

        /*        // old code, before the changeStartDate() had code to delete any Days that don't fall in the new range
         var query = refFbase_chain.orderByChild('date').startAt(startDate).endAt(endDate);
         $scope.data = $firebaseArray(query);*/

        var urlAttempt = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt + "/chain/";
        var ref = new Firebase(urlAttempt);
        // download the data into a local object
        var syncObject = $firebaseObject(ref);
        // synchronize the object with a three-way data binding
        // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "data");

      });


      $scope.showLoading = false;
    };

    $scope.getAtmptId = function () {
      //alert($routeParams.idhabit + "/" + $routeParams.idattempt);

      var textArea = document.createElement("textarea");

      //
      // *** This styling is an extra step which is likely not required. ***
      //
      // Why is it here? To ensure:
      // 1. the element is able to have focus and selection.
      // 2. if element was to flash render it has minimal visual impact.
      // 3. less flakyness with selection and copying which **might** occur if
      //    the textarea element is not visible.
      //
      // The likelihood is the element won't even render, not even a flash,
      // so some of these are just precautions. However in IE the element
      // is visible whilst the popup box asking the user for permission for
      // the web page to copy to the clipboard.
      //

      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent';


      textArea.value = $routeParams.idhabit + "/" + $routeParams.idattempt;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }

      document.body.removeChild(textArea);

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
      $scope.deletePoss = false;
      var refFbase_attempt = new Firebase("https://glowing-heat-6414.firebaseio.com/attempts/" + $routeParams.id);
      var syncObject = $firebaseObject(refFbase_attempt);
      syncObject.$bindTo($scope, "data");
      console.log();

      var url_Habit = reference_FirebaseRoot + "habits/" + currentAuth.uid + "/" + $routeParams.id;
      var refFbase_habit = new Firebase(url_Habit);
      var syncObjectHabit = $firebaseObject(refFbase_habit);
      syncObjectHabit.$bindTo($scope, "habitName");

      $scope.toggleDeletePoss = function () {
        $scope.deletePoss = !$scope.deletePoss;
        console.log("$scope.deletePoss " + $scope.deletePoss);
      };


      $scope.showLoading = false;
    };

    $scope.oldDateValue;
    $scope.storeOldStartDate = function (oldStartDate) {
      console.log("oldStartDate " + oldStartDate);
      $scope.oldDateValue = oldStartDate;
    }

    // TODO implement regex for incorrect date format http://stackoverflow.com/a/22061879/708355
    $scope.changeChainDates = function (chain, oldDate, newDate) {
      var newDate = window.prompt("Please enter the new date.\n" +
        "Please use format YYYY-MM-DD (2016-12-25)\n" +
        "Any day data outside of the updated 28 day range WILL be deleted!", newDate);
      console.log("" + (newDate) + (newDate !== "null") + (newDate !== "undefined"));
      if (newDate && newDate !== "null" && newDate !== "undefined") { // uhh the last 2 return true even though I know they aren't
        console.log("chain " + chain);
        console.log("oldDate " + oldDate);
        console.log("newDate " + newDate);
        var duration = moment.duration(moment(newDate).diff(moment(oldDate)));
        var difference = duration.asDays();
        console.log("day difference " + difference);

        var urlAttemptStart = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
        var refFbase_AttemptStartDate = new Firebase(urlAttemptStart);
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
          attemptData.child("chain").child(moment(oldDate).add(i + difference, 'days').format('YYYY-MM-DD')).update({
            //date: moment().format()
            //date: data[i].date
            date: moment(oldDate).add(i + difference, 'days').format('YYYY-MM-DD')
          });
        }

        // erase all dates that don't fit into the current date range
        attemptData.child('chain').once("value", function (snapshot) {

          var lowerBound = moment(oldDate).add(0 + difference, 'days').format('YYYY-MM-DD');
          var upperBound = moment(oldDate).add(27 + difference, 'days').format('YYYY-MM-DD');
          //console.log("lowerBound" + lowerBound);
          //console.log("upperBound" + upperBound);

          snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key();
            //console.log("key " + key);
            var childData = childSnapshot.val();
            //console.log("childData " + childData);
            //console.log(childSnapshot.key() + " " + lowerBound + "| " + (childSnapshot.key() <= lowerBound));
            //console.log(childSnapshot.key() + " " + upperBound + "| " + (childSnapshot.key() >= upperBound));
            if (childSnapshot.key() < lowerBound || childSnapshot.key() > upperBound) {
              console.log("!! Removing item " + key);
              //childSnapshot.remove(); // doesn't work, it's just a snapshot
              attemptData.child('chain').child(childSnapshot.key()).remove();
            }

          });
        });

        location.reload();

      } else {
        console.log("changeChainDates aborted");
      }


    };

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

    $scope.habitNameField = null;
    $scope.habitDescrField = null;

    $scope.arrayOfSuggestions = [];


    $scope.arrayOfSuggestions['mentalHealth'] = [
      ["Meditate Every Day", "To decrease stress levels."],
      ["Write In My Journal", "To reflect on my time."],
      ["Say Something I Like About Myself Out Loud", "For good self-esteem."]
    ];

    $scope.arrayOfSuggestions['physicalHealth'] = [
      ["Floss Every Day", "To reduce the risk of heart disease."],
      ["No Cigarettes", "To live a longer life for my family."],
      ["No Alcohol", "Hangovers are a waste of a day."],
      ["Eat 1 Serving of Fruit", "To prevent scurvy."],
      ["Eat 1 Serving of Vegetables", "For good bowel movements!"],
      ["Jog Every Day", "To look sexy."],
      ["Weight Lift Consistently, with Rest Days", "To impress Arnold."]
    ];

    $scope.changeHabitNameField = function (name, descr) {
      console.log(name + descr);
      $scope.book.name = name;
      $scope.book.description = descr;
      $scope.habitNameField = name;
      $scope.habitDescrField = descr;

      //document.getElementById("name").value = name;
      //document.getElementById("description").value = descr;

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
        //attempts: [attemptPush.key()],
        id: habitPush.key()
      });

      // add Attemt's ID to Habit's Attempt array
      var refFbase_attemptsArray = reference_FirebaseRoot.child("habits/" + currentAuth.uid + "/" + habitPush.key() + "/attempts/").child(attemptPush.key());
      refFbase_attemptsArray.set(attemptPush.key());

      attemptsRef.child(attemptPush.key()).update({
        id: attemptPush.key()
      });

      attemptsRef.update({
        uid: $scope.authData.uid
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
      var refFbase_attemptsArray = reference_FirebaseRoot.child("habits/" + currentAuth.uid + "/" + $routeParams.id + "/attempts/").child(attemptPush.key());
      refFbase_attemptsArray.set(attemptPush.key());


    };


    // This func isn't even updated. The update
    // Habit button isn't needed becuse the data's 2 way data binded
    $scope.updateHabit = function () {
      /*      var url = reference_FirebaseRoot + "attempts/" + $scope.book.id + "/" + $scope.book.attempts[];
       var attemptData = new Firebase(url);
       var syncobject = $firebaseObject(attemptData);
       syncobject.$bindTo($scope, "attemptData");
       console.log("syncobject1 " + syncobject);
       //$scope.dog = "woof";
       //alert(attemptData);
       var url2 = reference_FirebaseRoot + "habits/" + masterId + "/" + $scope.book.id + "/name";
       var habitName3 = new Firebase(url2);
       var syncobject2 = $firebaseObject(habitName3);
       syncobject2.$bindTo($scope, "habitData");*/

      $scope.showLoading = false;

      window.location = "/#/habit/" + $scope.book.id;

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

    $scope.deleteAttempt = function (habitId, attemptId) {
      //console.log(habitId + " | " + attemptId);
      // delete Attempt
      var attemptToDelete = reference_FirebaseRoot.child("attempts/" + habitId + "/" + attemptId);
      console.log("attemptToDelete " + attemptToDelete);
      attemptToDelete.remove();

      // delete Attempt's Habit's reference to Attempt
      var habtsAttmpRefToDelete = reference_FirebaseRoot.child("habits").child($scope.authData.uid).child(habitId).child("attempts").child(attemptId);
      habtsAttmpRefToDelete.remove();
      //console.log("deleteAttempt end");
    };

  }


}());