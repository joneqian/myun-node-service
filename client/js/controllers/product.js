angular
  .module('app')
  .controller('ProductController', ['$scope', 'Product', 'Order','$window',
    function ($scope, Product, Order,$window) {
      $scope.currentUser = JSON.parse($window.sessionStorage.getItem('currentUser'));
      $scope.products = Product.find({
        filter: {}
      }, function () {
        for (var i = 0; i < $scope.products.length; i++) {
          var product = $scope.products[i];
          product.msg = '';
          if (product.count > 0) {
            product.isCanSecKill = true;
            product.btn = '秒杀';
          } else {
            product.isCanSecKill = false;
            product.btn = '已售完';
          }

        }
      });

      setInterval(function () {
        for (var i = 0; i < $scope.products.length; i++) {
          var product = $scope.products[i];
          if (product.count <= 0) {
            continue;
          }

          var t = new Date(Date.parse(product.secKillEnd.replace(/-/g,"/"))).getTime();//取得指定时间的总毫秒数
          var n = new Date().getTime(),//取得当前毫秒数
              c = t - n;//得到时间差

          if (c >= 0) {
            product.remainTime = getRemainTime(c);
          } else {
            product.isCanSecKill = false;
            product.remainTime = '过期了';
            product.btn = '已过期';
          }
        }
        $scope.$digest();
      }, 100);

      $scope.submitForm = function (id) {
        var product = $scope.products[id - 1];
        if (product.isCanSecKill) {
          Order
            .secKillProduct({
              userId: $scope.currentUser.id,
              count: 1,
              productId: product.id
            })
            .$promise
            .then(function (res) {
              var status = JSON.parse(res.status);
              product.msg = status.msg;
              if (status.status < 4) {
                product.isCanSecKill = false;
                if (status.status <=1 ) {
                  product.btn = '失效';
                }

                if (status.status === 2 ) {
                  product.btn = '已售完';
                }

                if (status.status === 3 ) {
                  product.btn = '已购买';
                }
              }
            });
        }
      };

      function getRemainTime(sec) {
        var days = Math.floor(sec / (1000 * 60 * 60 * 24));
        var hours = Math.floor(sec / (1000 * 60 * 60)) % 24;
        var minutes = Math.floor(sec / (1000 * 60)) % 60;
        var seconds = Math.floor(sec / 1000) % 60;
        if (days < 0)
          days = 0;
        if (hours < 0)
          hours = 0;
        if (minutes < 0)
          minutes = 0;
        if (seconds < 0)
          seconds = 0;
        return days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
      }
    }]);
