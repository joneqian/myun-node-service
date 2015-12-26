var utils = require('../../server/util/utils');
module.exports = function (Order) {
  Order.beforeRemote('create', function (context, user, next) {
    var req = context.req;
    req.body.date = utils.formatTime(new Date());
    req.body.userId = req.accessToken.userId;
    Order.getApp(function (err , app) {
      if (err) {
        next(err);
      } else {
        app.models.Product.findById(req.body.productId, function (err, product) {
          if (err) {
            next(err);
            return;
          }

          if (!product) {
            next(new Error("商品不存在"));
            return;
          }

          if (product.count <= 0) {
            next(new Error("商品已售完"));
            return;
          }

          Order.find({where: {userId: req.body.userId, productId: req.body.productId}}, function (err, orders) {
            if (err) {
              next(err);
              return;
            }

            if (orders && orders.length >=2 ) {
              next(new Error("超出限购数量"));
              return;
            }

            next();
          });
        });
      }

    });
  });
};
