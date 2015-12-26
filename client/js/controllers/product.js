angular
  .module('app')
  .controller('ProductController', ['$scope', 'Product',
    function ($scope, Product) {
      $scope.products = Product.find({
        filter: {}
      }, function () {
        for (var i = 0; i < $scope.products.length; i++) {
          var product = $scope.products[i];
          product.isOverDue = false;
        }
      });

      setInterval(function () {
        for (var i = 0; i < $scope.products.length; i++) {
          var product = $scope.products[i];
          var t = new Date(product.secKillEnd);//取得指定时间的总毫秒数
          var n = new Date().getTime(),//取得当前毫秒数
            c = t - n;//得到时间差
          if (c >= 0) {
            product.remainTime = getRemainTime(c);
          } else {
            product.isOverDue = true;
            product.remainTime = '过期了';
          }
        }
        $scope.$digest();
      }, 100);

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
