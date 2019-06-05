var config = require('../../config');


/* Settings used by Client for Retrieving data (image/videos) */
exports.getSettings = function(req, res, next) {
    var settings = {};

    settings.s3BucketName = config.s3BucketName;
    settings.s3ApiKey = config.s3ApiKey;
    settings.s3ApiSecret = config.s3ApiSecret;
    settings.s3Path = config.s3Path;
    settings.cdnPath = config.cdnPath;
    settings.serverImagePath = config.serverImagePath;
    settings.s3ImagesFolderName = config.s3ImagesFolderName;
    settings.s3VideosFolderName = config.s3VideosFolderName;

    return res.status(200).jsonp({ 'settings': settings });
};