// I had to remove the self invoking expression surrounding the code before this would work.
'use strict';

angular
  .module('app.attemptViewer', [])
  .directive("attemptViewer", function () {
    return {
      restrict: "E",
      templateUrl: 'app/attemptViewer/attemptViewer.html'
    };

  });


