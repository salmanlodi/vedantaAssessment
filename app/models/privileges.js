const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var privilegeSchema = new Schema({
    privilegeName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
}, {
    collection: 'privileges',
    timestamps:true
});

privilegeSchema.pre('remove', function(next) {
    const _ = require('lodash');
    const Role = require('../models/roles').Role
    let RoleQuery = {

    }

    Role.findOneAndUpdate(RoleQuery, {
        $pull: {
            'privileges': this._id
        }
    }).then(data => {
        if (data) {
            next();
        } else {
            next(new Error('Error while pulling out privileges from Roles'))
        }
    })
})

let Privilege = mongoose.model('Privilege', privilegeSchema);
module.exports = {
    Privilege: Privilege
}