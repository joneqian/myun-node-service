angular
    .module('app')
    .controller('ProductController', ['$scope', 'Product', '$rootScope',
        function ($scope, Product, $rootScope) {
            $scope.products = Product.find({
                filter: {}
            });
        }]);
