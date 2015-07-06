var UsersController = function(){

    var 
        conf = require('../config/settings'),
        api = require("../utils/api"),
        request = require("request");


    var _login = function(req, res, next) {
        res.render("login");
    };

    var _doLogin = function(req, res, next) {
        console.log("params " + req.body.email + " password: " + req.body.password);
        api(null, {
            path: "/token",
            method: "POST",
            json: {
                grant_type: "password",
                username: req.body.email ,
                password: req.body.password
            },
            auth: {
                "user" : conf.get('community_api.client_id'),
                "pass" : conf.get('community_api.client_secret'),
                sendImmediately: true
            }
        },
        function(err, result, body) {
            if(err) return next(err);
            console.log("returned body %j", body)
            if(body.error) return res.render("login", {
                errors: [{error: body.error_description}],
                needsResponsive:true
            });

            req.session.token = body;

            return _getUser(req, function(err, result, body){
                if(err) return next(err);
                req.session.user = body;
                req.session.user.token = req.session.token;
                req.session.loggedIn = true;
                
                if(req.session.page) {
                    res.redirect(req.session.page);
                    req.session.page = null;
                } else res.redirect("/dashboard");
            });

        });
    };

    var _logout = function(req, res, next) {
        req.session.destroy();
        return res.redirect("/");
    };

    var _getUser = function(req, done) {
        api(req.session, {
            path: "/user",
            method: "GET",
        },
        done);
    };

    return {
        login: _login,
        doLogin: _doLogin,
        logout: _logout
    };

}();

module.exports = UsersController;