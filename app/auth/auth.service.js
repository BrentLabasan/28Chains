(function () {
  'use strict';

  angular
    .module('app.auth')
    .factory('authService', authService)
    //https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html
    //Retrieving Authentication State
    .factory('Auth', Auth);

  authService.$inject = ['$firebaseAuth', 'firebaseDataService'];
  Auth.$inject = ['$firebaseAuth'];

  function Auth($firebaseAuth) {
    var ref = new Firebase("https://glowing-heat-6414.firebaseio.com");
    return $firebaseAuth(ref);
  }

  function authService($firebaseAuth, firebaseDataService, partyService) {
    var firebaseAuthObject = $firebaseAuth(firebaseDataService.root);

    var service = {
      firebaseAuthObject: firebaseAuthObject,
      register: register,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      sendWelcomeEmail: sendWelcomeEmail
    };

    return service;

    ////////////

    function register(user) {
      return firebaseAuthObject.$createUser(user);
    }

    function login() {
      //function login(user) {
      //  return firebaseAuthObject.$authWithPassword(user);
      console.log("login");
      firebaseAuthObject.$authWithOAuthRedirect('facebook');
    }

    function logout() {
      //partyService.reset();
      console.log("logout");

      firebaseAuthObject.$unauth();
    }

    function isLoggedIn() {
      return firebaseAuthObject.$getAuth();
    }

    function sendWelcomeEmail(emailAddress) {
      firebaseDataService.emails.push({
        emailAddress: emailAddress
      });
    }

  }

})();