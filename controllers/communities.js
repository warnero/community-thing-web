var CommunityController = function(){
    var 
        conf = require('../config/settings'),
        api = require("../utils/api"),
        request = require("request");

    var _newCommunity = function(req, res, next) {
        return res.render('community_form', {
            title: 'Add Community'
        });
    };

    var _saveCommunity = function(req, res, next) {
        var newCommunity = {
            name: req.body.name,
            description: req.body.description,
            inviteOnly: req.body.inviteOnly ? true: false
        };

        api(req.session, {
            path: "/communities",
            method: "POST",
            json: newCommunity
        }, function(err, result, body) {
            if(err) return next(err);
            console.log("returned body %j", body)
            if(body.error) return res.render("community_form", {
                errors: [{error: body.error_description}]
            });

            res.redirect("/dashboard");

        });
    };

    var _get = function(req, res, next) {

        var id = req.params.id;

        api(req.session, {
            path: "/communities/" + id,
            method: "GET"
        }, function(err, result, body) {
            if(err) return next(err);
            console.log("returned community %j", body);
            return res.render('community', {
                title: 'Community > ' + body.name,
                community: body
            });

        });
    };

    return {
        get: _get,
        newCommunity: _newCommunity,
        saveCommunity: _saveCommunity
    };

}();

module.exports = CommunityController;
