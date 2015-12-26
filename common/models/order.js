var utils = require('../../server/util/utils');
module.exports = function (Order) {
  Order.beforeRemote('create', function (context, user, next) {
    var req = context.req;
    req.body.date = utils.formatTime(new Date());
    req.body.userId = req.accessToken.userId;
    Order.getApp(function (error , app) {
      if (error) {
        next(error);
      } else {
        app.models.Product.findById(req.body.productId, function (error, product) {
          if (error) {
            next(error);
            return;
          }

          if (!product) {
            next(new Error("product isn't exist"));
            return;
          }

          if (product.count <= 0) {
            next(new Error("product have been sold out"));
            return;
          }

          next();
        });
      }

    });
  });
};
