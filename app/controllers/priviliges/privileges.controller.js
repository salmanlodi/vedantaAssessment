var _ = require('lodash');


/* Used to extend all the module level controllers to router */

module.exports = _.extend(
    require('./privileges.api.controller')
);