angular.module('angularBootstrap')
  .controller('TabsDemoCtrl', function ($scope, $window) {
    $scope.tabs = [
      {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
      {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
    ];

    $scope.alertMe = function () {
      setTimeout(function () {
        $window.alert('You\'ve selected the alert tab!');
      });
    };

    $scope.model = {
      name: 'Tabs'
    };

    $scope.statusChoices = {
      choices: ["Yes", "No"]
    };
  })
  .controller('DatepickerDemoCtrl', function ($scope) {
    $scope.today = function () {
      $scope.bookdt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.bookdt = null;
    };

    // Disable weekend selection
    /*    $scope.disabled = function(date, mode) {
     return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
     };*/

    $scope.toggleMin = function () {
      $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
      $scope.bookdt = new Date(year, month, day);
    };

    $scope.bookBook = new Date('2016-01-01');

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
    //$scope.format = "MM/dd/yyyy";
    $scope.format = "yyyy-MM-dd";
    //$scope.format = "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ";
    //$scope.format = "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ";
    //$scope.format = "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ";
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
      opened: false
    };

    $scope.popup2 = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events =
      [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

    $scope.getDayClass = function (date, mode) {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    };
  })
  .controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {

    $scope.items = ['item18', 'item29', 'item30'];

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
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


  })
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, client, esFactory) {
// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
    $scope.searchTerm = "search term"
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.searchForAttempts = function(term) {
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
        $scope.meow = resp.hits.hits;
      }, function (err) {
        console.trace(err.message);
      });
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