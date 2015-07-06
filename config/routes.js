var Routes = function(app, passport) {
    var 
        home = require("../controllers/home"),
        users = require("../controllers/users"),
        communities = require("../controllers/communities"),
        calendars = require("../controllers/calendars");

    var HomeRoutes = function () {
        app.get("/", home.index);
        app.get("/dashboard", home.dashboard);
    }();

    var UserRoutes = function () {
        app.get("/login", users.login);
        app.post("/login", users.doLogin);
        app.get("/logout", users.logout);
    }();

    var CommunityRoutes = function () {
        app.get("/community/add", communities.newCommunity);
        app.post("/community/add", communities.saveCommunity);
        app.get("/communities/:id", communities.get);
    }();

    var CalendarRoutes = function () {
        app.get("/communities/:id/new_meetup", calendars.newMeetupCalendar);
        app.post("/communities/:id/add_meetup", calendars.saveMeetupCalendar);
    }();

    // var FacebookRoutes = function() {
    //     app.get('/login', function(req, res, next){
    //         res.render('facebook_login');
    //     });
    //     app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    //     app.get('/auth/facebook/callback',
    //         passport.authenticate('facebook', {
    //             successRedirect : '/user/profile',
    //             failureRedirect : '/'
    //         }));
    // }();

    return this;
};

module.exports = Routes;
