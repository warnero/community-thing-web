var cluster = require('cluster'),
    numCPUs = Math.min(2,require('os').cpus().length);

if (cluster.isMaster && process.env.NODE_ENV == "production") {
    // Fork workers
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });

    return;
}

/**
 * Module dependencies.
 */

var 
    conf = require("./config/settings"),
    express = require('express'), 
    hbs = require('hbs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    session = require('express-session'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    http = require('http'), 
    path = require('path'), 
    connect = require('connect'), 
    fs = require('fs'),  
    crypto = require('crypto'),
    RedisStore = require('connect-redis')(session),
    passport = require('passport'),
    flash    = require('connect-flash');

Q  = require('q');

var partialsDir = __dirname + '/views/partials';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).html$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});
var SITE_SECRET = 'piggy_secret_my_secret';

var app = express();

// require('./config/passport')(passport);

app.set('port', conf.get('port'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', hbs.__express);
// app.use(favicon());
if(process.env.NODE_ENV != "production" && process.env.NODE_ENV != "testing") app.use(morgan('dev'));

app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser(SITE_SECRET));
app.use(session({ secret: SITE_SECRET })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
app.use(flash()); 
app.use(session({
  secret: SITE_SECRET,
  cookie: {
    maxAge: 60*60*1000*24*30
  },
  store: new RedisStore(conf.get('redis.options'))
}));
app.use(require('connect-flash')());
app.use(require('less-middleware')(__dirname + '/public' ));
app.use(express.static(path.join(__dirname, './public')));

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.use(errorHandler());
}

var 
  routes = require("./config/routes")(app, null);

var 
    server = http.createServer(app),
    utils = require('connect').utils;


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

