var utils = require('../../server/util/utils');
module.exports = function (Order) {
  /*Order.beforeRemote('create', function (context, user, next) {
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

            if (orders && orders.length >= 2 ) {
              next(new Error("超出限购数量"));
              return;
            }

            product.count--;
            product.save(function (err, savedObj) {
              if (err) {
                next(err);
              } else {
                next();
              }
            });
          });
        });
      }

    });
  });*/

  Order.secKillProduct = function(data, cb) {
    Order.getApp(function (err , app) {
      var errStr = JSON.stringify({status:0, msg:'异常错误'});
      if (err) {
        cb(null, errStr);
      } else {
        app.models.Product.findById(data.productId, function (err, product) {
          if (err) {
            cb(null, errStr);
            return;
          }

          if (!product) {
            cb(null, JSON.stringify({status:1, msg:'商品不存在'}));
            return;
          }

          if (product.count <= 0) {
            cb(null, JSON.stringify({status:2, msg:'商品已售完'}));
            return;
          }

          Order.find({where: {userId: data.userId, productId: data.productId}}, function (err, orders) {
            if (err) {
              cb(null, errStr);
              return;
            }

            if (orders && orders.length >= product.purchaseLimit ) {
              cb(null, JSON.stringify({status:3, msg:'超出限购数量'}));
              return;
            }

            product.count--;
            product.save(function (err) {
              if (err) {
                cb(null, errStr);
              } else {
                Order.create({date: data.date, count: 1, productId: data.productId, userId: data.userId},
                  function (err) {
                    if (err) {
                      cb(null, errStr);
                    } else {
                      cb(null, JSON.stringify({status:4, msg:'购买成功'}));
                    }
                });
              }
            });
          });
        });
      }
    });
  };
  Order.remoteMethod(
    'secKillProduct',
    {
      accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
      returns: {arg: 'status', type: 'string'},
      http: {path:'/sec-kill-product', verb: 'post'}
    }
  );
  // remote method before hook
  Order.beforeRemote('secKillProduct', function(context, unused, next) {
    var req = context.req;
    req.body.date = utils.formatTime(new Date());
    //req.body.userId = req.accessToken.userId;
    next();
  });
};
