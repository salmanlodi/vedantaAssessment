const inventory = require('../../controllers/inventory/inventory.controller');
import {
    User
} from '../../utils/enum/user.enum';
var express = require('express')
var router = express.Router()

// sample for authentication middleware router.get('/', users.hasAuthorization([User.SUPER_ADMIN]), privilege.getAllPrivileges) 
router.get('/', inventory.getInventoryItems)
router.post('/', inventory.createItem)

module.exports = router;