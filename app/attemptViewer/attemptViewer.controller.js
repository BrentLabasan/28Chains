(function () {
  'use strict';

  angular
    .module('app.attemptViewer')
    .controller('attemptViewerController', attemptViewerController)
    .controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {




    })
    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, arr1, arr2, wayne, client, esFactory) {
// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
      $scope.searchTerm = "temptation"
      $scope.arr1 = arr1;
      $scope.arr2 = arr2;
      $scope.wayne2 = wayne;
/*      $scope.selected = {
        item: $scope.items[0]
      };*/

      $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.krakatoa = function (term) {
        $scope.wayne2(term);
        $uibModalInstance.dismiss('cancel');
      };

      $scope.setAttemptLoaded = function(atmptId) {

        if (atmptId) {
          // retrieves text in
          $scope.attemptIdLoaded = document.getElementById("queryAttemptID").value;
          //console.log("setting Attempt loaded to ID " + $scope.attemptIdLoaded);
          var arr = $scope.attemptIdLoaded.split("/");
          var idHabit = arr[0];
          var idAttempt = arr[1];
          console.log(idHabit + " " + idAttempt);

          // TODO in progress
          //var url_attempt = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
          var url_attempt = reference_FirebaseRoot + "attempts/" + idHabit + "/" + idAttempt;
          var refFbase_attempt = new Firebase(url_attempt);
          var syncObjectAttempt = $firebaseObject(refFbase_attempt);
          syncObjectAttempt.$bindTo($scope, "otherAttempt");
          var xxx = refFbase_attempt.child('uid');
          var userId;
          refFbase_attempt.child('uid').on("value", function(snapshot) {
            userId = snapshot.val();
            //var url_Habit = reference_FirebaseRoot + "habits/" + currentAuth.uid + "/" + $routeParams.idhabit;
            var url_Habit = reference_FirebaseRoot + "habits/" + userId + "/" + idHabit;
            var refFbase_habit = new Firebase(url_Habit);
            var syncObjectHabit = $firebaseObject(refFbase_habit);
            syncObjectHabit.$bindTo($scope, "otherHabit");
          });
        }

      };

      $scope.loadAtmptFrmSrch = function(atmptId) {
        //alert();
        $scope.setAttemptLoaded(atmptId);
        $scope.cancel();
      };

      $scope.searchForAttempts = function(term) {

        if (term) {
          //console.log("meh");
          client.cluster.state({
              metric: [
                'cluster_name',
                'nodes',
                'master_node',
                'version'
              ]
            })
            .then(function (resp) {
              $scope.clusterState = resp;
              $scope.error = null;
            })
            .catch(function (err) {
              $scope.clusterState = null;
              $scope.error = err;

              // if the err is a NoConnections error, then the client was not able to
              // connect to elasticsearch. In that case, create a more detailed error
              // message
              if (err instanceof esFactory.errors.NoConnections) {
                $scope.error = new Error('Unable to connect to elasticsearch. ' +
                  'Make sure that it is running and listening at http://localhost:9200');
              }
            });

          client.search({ //https://dashboard.searchly.com/17573/installation/nodejs#
            index: 'attempt',
            type: 'internal',
            body: {
              "query": { // http://joelabrahamsson.com/elasticsearch-101/    Basic free text search
                "query_string": {
                  "query": term
                }
              }
            }
          }).then(function (resp) {
            console.log("RESP");
            console.log(resp);
            var hits = resp.hits.hits;
            $scope.searchResults = resp.hits.hits;
          }, function (err) {
            console.trace(err.message);
          });
        }

      };

    });

  app.service('client', function (esFactory) {
    return esFactory({
      host: 'localhost:9200',
//        host: 'https://paas:6f0aa4d02b9330765a79b677dd412747@dori-us-east-1.searchly.com',
      apiVersion: '1.6',
      log: 'trace'
    });
  });

  attemptViewerController.$inject = [
    '$scope',
    '$location',
    '$http',
    '$firebase',
    '$firebaseObject',
    '$firebaseArray',
    '$firebaseAuth',
    '$routeParams',
    '$uibModal',
    '$log'

  ];


  function attemptViewerController($scope,
                                   $location,
                                   $http,
                                   $firebase,
                                   $firebaseObject,
                                   $firebaseArray,
                                   $firebaseAuth,
                                   $routeParams,
                                   $uibModal,
                                   $log
  ) {

    $scope.drake = function() {
      alert("drake");
    };

    $scope.inModalDemoCtrl = "inModalDemoCtrl";

    $scope.arr1 = ['items1a', 'items1b', 'items1c'];
    $scope.arr2 = ['items2a', 'items2b', 'items2c'];

    $scope.wayne = function() {
      alert("wayne");
    };

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          arr2: function () {
            return $scope.arr2;
          },
          arr1: function () {
            return $scope.arr1;
          },
          wayne: function () {
            return $scope.setAttemptLoaded;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };




    $scope.attemptIdLoaded ;

    $scope.setAttemptLoaded = function(term) {
      debugger;
      alert(term);
      if (term) {
        $scope.attemptIdLoaded = term;
      } else {
        $scope.attemptIdLoaded = document.getElementById("queryAttemptID").value;
        //console.log("setting Attempt loaded to ID " + $scope.attemptIdLoaded);
      }
      // retrieves text in

      var arr = $scope.attemptIdLoaded.split("/");
      var idHabit = arr[0];
      var idAttempt = arr[1];
      console.log(idHabit + " " + idAttempt);

      // TODO in progress
      //var url_attempt = reference_FirebaseRoot + "attempts/" + $routeParams.idhabit + "/" + $routeParams.idattempt;
      var url_attempt = reference_FirebaseRoot + "attempts/" + idHabit + "/" + idAttempt;
      var refFbase_attempt = new Firebase(url_attempt);
      var syncObjectAttempt = $firebaseObject(refFbase_attempt);
      syncObjectAttempt.$bindTo($scope, "otherAttempt");
      var userId;
      refFbase_attempt.child('uid').on("value", function(snapshot) {
        userId = snapshot.val();
        //var url_Habit = reference_FirebaseRoot + "habits/" + currentAuth.uid + "/" + $routeParams.idhabit;
        var url_Habit = reference_FirebaseRoot + "habits/" + userId + "/" + idHabit;
        var refFbase_habit = new Firebase(url_Habit);
        var syncObjectHabit = $firebaseObject(refFbase_habit);
        syncObjectHabit.$bindTo($scope, "otherHabit");
      });

console.log("end of setAttemptLoaded");
    };

    $scope.unloadAttempt = function() {
      $scope.attemptIdLoaded = null;
    };


    console.log("end attemptViewerController");

  }


}());