const privilege = require('../../controllers/priviliges/privileges.api.controller');
const users = require('../../controllers/users/index.controller');
import {
    User
} from '../../utils/enum/user.enum';
var express = require('express')
var router = express.Router()


router.get('/', users.hasAuthorization([User.SUPER_ADMIN]), privilege.getAllPrivileges)
router.post('/', users.hasAuthorization([User.SUPER_ADMIN]), privilege.createPrivilege)
router.delete('/:privilegeId/', users.hasAuthorization([User.SUPER_ADMIN]), privilege.deleteById)

module.exports = router;