const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user').User

var RoleSchema = new Schema({
    roleId: {
        type: Number,
        default: 1,
        required: false
    },
    roleName: {
        type: String,
        required: true
    },
    privileges: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Privilege'
    }]
}, {
    collection: 'roles',
    timestamps:true
});

RoleSchema.pre('save', function(next) {
    Role.find({}).sort({
        roleId: -1
    }).limit(1).then(result => {
        if (result.length == 0) {
            this.roleId = 1;
            next();
        } else {
            this.roleId = result[0]._doc.roleId + 1
            next();
        }
    });

})

RoleSchema.pre('remove', function(next) {
    let query = {
        roleId: this._id
    }
    let update = {
        $set: {
            roleId: null
        }
    }
    User.update(query, update)
        .then(result => {
            next();
        });

})

let Role = mongoose.model('Roles', RoleSchema);
module.exports = {
    Role: Role
}