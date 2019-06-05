const role = require('../../controllers/role/role.controller')
const privilege = require('../../controllers/priviliges/privileges.controller')
var express = require('express')
const users = require('../../controllers/users/index.controller');
import {
    User
} from '../../utils/enum/user.enum';

var router = express.Router()


router.post('/', users.hasAuthorization([User.SUPER_ADMIN]), role.createRole);
router.get('/', users.hasAuthorization([User.SUPER_ADMIN]), role.getRoles);
router.delete('/:roleId/', users.hasAuthorization([User.SUPER_ADMIN]), role.deleteById)
router.put('/assign/:roleId/user/:userId', users.hasAuthorization([User.SUPER_ADMIN]), role.assignRole)

/* grant and revoking the privileges to roles */

router.put('/:roleId/permit/privilege/', users.hasAuthorization([User.SUPER_ADMIN]), privilege.updatePrivilege)


module.exports = router;