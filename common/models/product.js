module.exports = function(Product) {
  Product.getProjects = function(cb) {
    Product.getApp(function (err , app) {
      var errStr = JSON.stringify({status:0, msg:'异常错误'});
      if (err) {
        cb(null, errStr);
      } else {
        app.models.Product.find({}, function (err, projects) {
          if (err) {
            cb(null, errStr);
            return;
          }

          if (!projects) {
            cb(null, JSON.stringify({projects:[]}));
            return;
          }

          if (projects.count <= 0) {
            cb(null, JSON.stringify({projects:[]}));
            return;
          }

          cb(null, JSON.stringify({projects:projects}));
        });
      }
    });
  };
  Product.remoteMethod(
    'getProjects',
    {
      returns: {arg: 'projects', type: 'string'},
      http: {path:'/get-products', verb: 'get'}
    }
  );
};
