var API = function(){

    var 
        conf = require("../config/settings"),
        request = require("request");


    var _request = function(session, data, done){
        if(!data.path) return done({error: "Path required."});
        if(!data.url) data.url = conf.get('community_api.url') + "/" + data.path;
        
        data.headers = data.headers || {};
        if(session) console.log("session data", session.token);
        if(session && session.token && session.token.token_type && session.token.access_token) {
            data.headers.Authorization = session.token.token_type + " " + session.token.access_token;
        }

        if((!data.method || data.method == "GET") && !data.json) data.json = true;
        return request(data, done);
    };


    return _request

}();

module.exports = API;