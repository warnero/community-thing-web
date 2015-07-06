var CalendarController = function(){
    var 
        conf = require('../config/settings'),
        api = require("../utils/api"),
        request = require("request");

    var _newMeetupCalendar = function(req, res, next) {
        var community_id = req.params.id;
        return res.render('add_meetup_calendar', {
            title: 'Add New Meetup Calendar',
            community_id: community_id
        });
    };

    var _saveMeetupCalendar = function(req, res, next) {
        var community_id = req.params.id;
        var newMeetupCalendar = {
            feedUrl: req.body.feedUrl,
            notes: req.body.notes,
            public: req.body.public ? true: false
        };

        api(req.session, {
            path: "/calendars/meetup",
            method: "POST",
            json: newMeetupCalendar
        }, function(err, result, body) {
            if(err) return next(err);
            console.log("returned body %j", body)
            if(body.error) return res.render("add_meetup_calendar", {
                errors: [{error: body.error_description}],
                community_id: community_id
            });

            res.redirect("/communities/" + community_id);

        });
    };

    return {
        saveMeetupCalendar: _saveMeetupCalendar,
        newMeetupCalendar: _newMeetupCalendar
    };

}();

module.exports = CalendarController;
