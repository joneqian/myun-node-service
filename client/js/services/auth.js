angular
    .module('app')
    .factory('AuthService', ['MYUser', '$q', '$rootScope', '$window', function (MYUser, $q,
                                                                                $rootScope, $window) {
        function login(email, password) {
            return MYUser
                .login({email: email, password: password})
                .$promise
                .then(function (response) {
                    $rootScope.currentUser = {
                        id: response.user.id,
                        tokenId: response.id,
                        email: email
                    };
                    $window.sessionStorage.setItem('currentUser', JSON.stringify($rootScope.currentUser));
                });
        }

        function logout() {
            return MYUser
                .logout()
                .$promise
                .then(function () {
                    $rootScope.currentUser = null;
                });
        }

        function register(email, password) {
            return MYUser
                .create({
                    email: email,
                    password: password
                })
                .$promise;
        }

        return {
            login: login,
            logout: logout,
            register: register
        };
    }]);
