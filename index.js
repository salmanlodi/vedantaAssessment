'use strict';
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');
var routes = require('./app/router/routes');
var Raven = require('raven');


// Must configure Raven before doing anything else with it
Raven.config('https://bb78b37d85bb40ec8470e2a4afb78fe1@sentry.io/1276466').install(); //remove 1 while deploying 




var helmet = require('helmet');
// Get .env varaibales and assign to process.env
require('dotenv').config()
var app = express();
// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());

app.use(bodyParser.json({limit:'50mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
app.use(cookieParser());
app.use(helmet()) // Used for security purpose . avoid x-powered-by
app.use(cors()); // enable CORS and we can whitelist the domains later to allow. TODO
app.use(passport.initialize());
//app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var logger = require('./app/utils/logger/winston-logger');
// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
    skip: function(req, res) { return res.statusCode < 400 }
}));

// log all requests to file path
app.use(require("morgan")("common", {
    "stream": logger.stream
}));
// Get Mongoose to use the global promise library
//mongoose.Promise = global.Promise;
//Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

/* intialize routes */
/* app.use('/',routes) */
routes(app)
/* Bootstrap local passport config */
require('./app/utils/passport')();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(Raven.errorHandler());


if (process.env.NODE_ENV === "development") {
    function devErrorHandler(err, req, res, next) {
       
        if (res.headersSent) {
            return next(err)
        }
        res.sentry;
        res.status(err.status || 500).json({
            error: err,
            message: err.message,
            stack: err.stack
        });
        // res.statusCode = err.status || 500;
        // res.send(res.sentry + '\n');
    }
    app.use(devErrorHandler);
} else if (process.env.NODE_ENV === "production") {
    function prodErrorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err)
        }
        res.status(err.status || 500).json({
            error: err,
            message: err.message
        });
    }
    app.use(prodErrorHandler);
}

// app.listen(8000,(err,su)=>{
//     if(err){
//         console.log('Error has occured')
//     }
//     else{
//         console.log('Started in port 8000')
//     }
// })
module.exports = app;