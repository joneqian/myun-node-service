angular
  .module('app')
  .controller('AuthLoginController', ['$scope', 'AuthService', '$state', '$window', '$rootScope',
    function ($scope, AuthService, $state, $window, $rootScope) {
      $rootScope.currentUser = null;
      $window.sessionStorage.removeItem('currentUser');
      $scope.user = {
        email: 'qianqing0@aliyun.com',
        password: '123'
      };

      $scope.login = function () {
        AuthService.login($scope.user.email, $scope.user.password)
          .then(function () {
            $state.go('my-product');
          });
      };
    }])
  .controller('AuthLogoutController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });
    }])
  .controller('SignUpController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      $scope.user = {
        email: '',
        password: ''
      };

      $scope.register = function () {
        AuthService.register($scope.user.email, $scope.user.password)
          .then(function () {
            $state.transitionTo('sign-up-success');
          });
      };
    }]);
