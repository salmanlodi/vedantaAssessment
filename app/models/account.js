const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
// const logger = require('../utils/logger/winston-logger');

var AccountSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        enum: ['Seller','Buyer'],
        default: 'Buyer' 
    }
}, {
    collection: 'account',
    timestamps:true
});

AccountSchema.post('save', function(){
    //operations to be done after saving items to account
})

var Account = mongoose.model('Account', AccountSchema)
module.exports = {
    Account: Account
}