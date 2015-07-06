var HomeController = function(){
    var 
        api = require("../utils/api");

    var _index = function(req, res, next) {
        
        return res.render('index', {
            title: 'Home'
        });
    };

    var _dashboard = function(req, res, next) {
        api(req.session, {
            path: "/communities",
            method: "GET"
        }, function(err, result, body) {
            if(err) return next(err);
            console.log("returned body %j", body)
            if(body.error) return res.render("community_form", {
                errors: [{error: body.error_description}]
            });

            return res.render('dashboard', {
                title: 'Community Dashboard',
                communities: body
            });

        });
        
    };

    return {
        index: _index,
        dashboard: _dashboard
    };

}();

module.exports = HomeController;
