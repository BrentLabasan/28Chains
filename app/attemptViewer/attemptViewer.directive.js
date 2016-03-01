
  'use strict';

  angular
    .module('app.attemptViewer', [])
    .directive("w3TestDirective", function () {
      return {
        restrict: "E",
        template: "<h1>Made by a directive!</h1>"
      };

    })();


