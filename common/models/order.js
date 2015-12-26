var utils = require('../../server/util/utils');
module.exports = function (Order) {
  Order.beforeRemote('create', function (context, user, next) {
    var req = context.req;
    req.body.date = utils.formatTime(new Date());
    req.body.userId = req.accessToken.userId;
    next();
  });
};
