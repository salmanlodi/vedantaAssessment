var _ = require('lodash');


/* Used to extend all the module level controllers to router */

module.exports = _.extend(
    require('./inventory.api.controller')
);