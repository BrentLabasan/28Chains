(function () {
  'use strict';

  angular
    .module('app.static')
    .controller('StaticController', StaticController);

  StaticController.$inject = ['$location', 'authService'];

  function StaticController($location, authService) {

/*    var vm = this;

    vm.error = null;

    vm.register = register;
    vm.login = login;

    function register(user) {
      return authService.register(user)
        .then(function () {
          return vm.login(user);
        })
        .then(function () {
          return authService.sendWelcomeEmail(user.email);
        })
        .catch(function (error) {
          vm.error = error;
        });
    }

    function login(user) {
      return authService.login(user)
        .then(function () {
          $location.path('/waitlist');
        })
        .catch(function (error) {
          vm.error = error;
        });
    }*/

  }

})();