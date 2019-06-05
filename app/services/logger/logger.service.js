const logger = require('../../utils/logger/winston-logger')

module.exports.logDeletion = function(collection,obj) {
    var logObj = obj.toObject();
    logObj['id'] = logObj._id.toString();
    logger.warn( collection + ' deleted' , logObj);
}