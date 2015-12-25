/**
 * Created by LeYi on 2015/12/25.
 */
var async = require('async');

module.exports = function (app) {
    // create all models
    async.parallel({
        users: async.apply(createUsers)
    }, function(err, results) {
        if (err) throw err;

        console.log('> models created successfully');
        console.log('> create ' + results.users.length +' users');
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
            var productName = '��Ʒ'+ i;
            var secKillStart = new Date();
            products[i] = {name: productName, count: 1000 + i, isSecKill: true, secKillStart: secKillStart,
                secKillEnd: secKillStart + 3600000};
        }
        app.models.MYUser.create(users, cb);
    }
};