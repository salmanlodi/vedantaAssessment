const account = require('../../controllers/account/account.controller');
import {
    User
} from '../../utils/enum/user.enum';
var express = require('express')
var router = express.Router()

// sample for authentication middleware router.get('/', users.hasAuthorization([User.SUPER_ADMIN]), privilege.getAllPrivileges) 
router.get('/', account.getAccounts)
router.post('/', account.createAccount)


module.exports = router;