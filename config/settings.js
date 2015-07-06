var convict = require('convict');

var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "staging", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    ip: {
        doc: "The IP address to bind.",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "IP_ADDRESS",
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 9000,
        env: "PORT"
    },
    redis: {
        url: "redis://localhost:6379",
        options: {
            host: "",
            port: "",
            pass: ""
        },
        debug: false,
        prefix: "community-web:",
        env: "REDISTOGO_URL"
    },
    community_api: {
        url: 'http://localhost:4000',
        client_id: "foo",
        client_secret: "bar",
        key: 'key goes here when ready'
    },
})


var env = conf.get('env');
console.log("port before loading env specifics %s, env port %s", conf.get('port'),process.env.PORT);
conf.loadFile (__dirname + '/'+  env + '_config.json');

conf.validate();

var saveRedisDetails = function () {
    console.log("calling redis details");
    var redis_url = require("url").parse(conf.get('redis.url'));
    conf.set('redis.options.host', redis_url.hostname);
    conf.set('redis.options.port', redis_url.port);
    if(redis_url.auth) {
        conf.set('redis.options.pass', redis_url.auth.split(":")[1]);
    }
}();

module.exports = conf;


