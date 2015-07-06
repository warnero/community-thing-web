var AuthController = function(){
    var
        Settings = require("../config/settings"),
        User = require("../models/user");

    // route middleware to make sure a user is logged in
    var _isLoggedIn = function(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

    var _logout = function(req, res, next) {
        req.logout();
        res.redirect('/');
    }

    return {
        isLoggedIn: _isLoggedIn,
        logout :_logout
    };

}();

module.exports = AuthController;