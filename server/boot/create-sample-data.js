/**
 * Created by LeYi on 2015/12/25.
 */
var async = require('async');
var utils = require('../util/utils');

module.exports = function (app) {
    // create all models
    async.parallel({
        users: async.apply(createUsers),
        products: async.apply(createProducts)
    }, function(err, results) {
        if (err) throw err;

        console.log('> models created successfully');
        console.log('> create ' + results.users.length +' user');
        console.log('> create ' + results.products.length +' product');
    });

    // create user
    function createUsers(cb) {
        var users = [];
        for (var i = 0; i < 3; i++) {
            var emailStr = 'qianqing'+ i + '@aliyun.com';
            users[i] = {email: emailStr, password: '123'};
        }
        app.models.MYUser.create(users, cb);
    }

    // create product
    function createProducts(cb) {
        var products = [];
        for (var i = 0; i < 3; i++) {
            var productName = '商品'+ i;
            var secKillStart = new Date();
            var secKillEnd = new Date();
            secKillEnd.setMinutes(secKillStart.getMinutes() + 1);
            products[i] = {name: productName, count: 1000 + i, isSecKill: true,
                secKillStart: utils.formatTime(secKillStart), secKillEnd: utils.formatTime(secKillEnd)};
        }
        app.models.Product.create(products, cb);
    }
};