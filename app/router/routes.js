const users = require('../controllers/users/index.controller');

module.exports = function(app) {
    // app.all('/api/v1/*',users.isAuthenticated)
    app.use('/', require('./index'))
    app.use('/api/v1/account', require('./account/account.v1'))
    app.use('/api/v1/inventory', require('./inventory/inventory.v1'))
    app.use('/api/v1/order', require('./order/order.v1'))
    app.use('/api/v1/privileges', require('./privileges/privileges.v1'))
    app.use('/api/v1/role',require('./role/role.v1'))

    //router.get('/signout', users.signout);
}