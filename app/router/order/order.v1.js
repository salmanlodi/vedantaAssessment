const order = require('../../controllers/order/order.controller');
import {
    User
} from '../../utils/enum/user.enum';
var express = require('express')
var router = express.Router()

// sample for authentication middleware router.get('/', users.hasAuthorization([User.SUPER_ADMIN]), privilege.getAllPrivileges) 
router.get('/', order.getOrders)
router.post('/', order.createOrder)

module.exports = router;