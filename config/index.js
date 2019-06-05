'use strict';

/* Config related to Production Environment */
require('dotenv').config()

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../');
module.exports = {
    app: {
        title: 'Flap Admin Server - Schoolcom',
        description: ''
    },
    root: rootPath,
    port: process.env.PORT || 6001,
    logPath: process.env.LOGS_PATH || require('path').join('logs/'),    
    db: {
        MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/flap-admin'
    },

    mailer: {
        from: process.env.MAILER_FROM || 'no-reply@schoolcom.in',
    },
    env: process.env.NODE_ENV || 'production',
    secret: process.env.JWT_SECRET || '',
    s3BucketName: process.env.S3_BUCKET_NAME || '',
    s3ApiKey: process.env.S3_API_KEY || '',
    s3ApiSecret: process.env.S3_API_SECRET || '',
    s3ImagesFolderName: process.env.S3_IMAGES_FOLDERNAME || '',
    s3VideosFolderName: process.env.S3_VIDEOS_FOLDERNAME || '',
    s3Path: process.env.S3_PATH || '',
    cdnPath: process.env.S3_CDN_PATH || '',
    serverImagePath: process.env.SERVER_IMAGE_PATH || '',
    master_salt: process.env.MASTER_SALT || 'shipflap',
    reset_password_salt: process.env.RESET_PASSWORD_SALT,
    sentryConfig: process.env.sentryConfig,
    API_KEY_FOR_READ:process.env.API_KEY_FOR_READ
};