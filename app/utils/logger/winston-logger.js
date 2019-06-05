'use strict';
var winston = require('winston');
let DailyRotateFile = require('winston-daily-rotate-file');
var config = winston.config;
var flapConfig = require('../../../config');
var logger = new winston.Logger({
    transports: [
        new DailyRotateFile({
            name: 'info_logs',
            level: 'info',
            filename: flapConfig.logPath + '/info-logs-%DATE%.log',
            json: true,
            // maxsize: 5242880, //5MB
            // maxFiles: 5,
            colorize: false,
            datePattern: 'DD-MM-YYYY-HH',
            zippedArchive: false, // archive the files . 
            maxSize: '10m', // each file of size 10 MB . later it starts new 
            maxFiles: '14d' //two weeks after which logs will be removed
        }),
        new DailyRotateFile({
            name: 'error_logs',
            level: 'error',
            filename: flapConfig.logPath + './error-logs-%DATE%.log',
            json: true,
            // maxsize: 5242880, //5MB
            // maxFiles: 5,
            colorize: false,
            datePattern: 'DD-MM-YYYY-HH',
            zippedArchive: false, // archive the files . 
            maxSize: '10m', // each file of size 10 MB . later it starts new 
            maxFiles: '14d' //two weeks after which logs will be removed
        }),
        new DailyRotateFile({
            name: 'delete_logs',
            level: 'warn',
            filename: flapConfig.logPath + '/delete-logs-%DATE%.log',
            json: true,
            // maxsize: 5242880, //5MB
            // maxFiles: 5,
            colorize: false,
            datePattern: 'DD-MM-YYYY-HH',
            zippedArchive: false, // archive the files . 
            maxSize: '10m', // each file of size 10 MB . later it starts new 
            maxFiles: '14d' //two weeks after which logs will be removed
        }),
        new winston.transports.Console({
            name: 'console_log',
            level: 'error',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            colorize: true
                /*  timestamp: function() {
                       return Date.now();
            },
             formatter: function(options) {
        // - Return string will be passed to logger.
        // - Optionally, use options.colorize(options.level, <string>) to
        //   colorize output based on the log level.
                  return options.timestamp() + ' ' +
                    config.colorize(options.level, options.level.toUpperCase()) + ' ' +
                    (options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                }*/
        })
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            name: 'exceptions_log',
            filename: flapConfig.logPath + '/exceptions-log-%DATE%.log',
            json: true,
            // maxsize: 5242880, //5MB
            // maxFiles: 5,
            colorize: false,
            datePattern: 'DD-MM-YYYY-HH',
            zippedArchive: false, // archive the files . 
            maxSize: '10m', // each file of size 10 MB . later it starts new 
            maxFiles: '14d', //two weeks after which logs will be removed
            humanReadableUnhandledException: true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;