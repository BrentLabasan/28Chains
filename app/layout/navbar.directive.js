(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('gzNavbar', gzNavbar);

  function gzNavbar() {
    return {
      templateUrl: 'app/layout/navbar.html',
      restrict: 'E',
      scope: {},
      controller: NavbarController,
      controllerAs: 'vm'
    };
  }

  NavbarController.$inject = ['$location', 'authService', '$scope', 'Auth'];

  function NavbarController($location, authService, $scope, Auth) {

    //https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html
    //Retrieving Authentication State
    $scope.auth = Auth;
    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
      console.log("$scope.auth.$onAuth in navbar.directive.js");
      console.log(authData);
      $scope.authData = authData;
    });

    var vm = this;

    vm.isLoggedIn = authService.isLoggedIn;
    vm.login = login;
    vm.logout = logout;

    function login() {
      authService.login();
      $location.path('/');
    }

    function logout() {
      authService.logout();
      $location.path('/');
    }
  }

})();