const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
// const logger = require('../utils/logger/winston-logger');

var InventorySchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'account'
    },
    price:{
        type:Number,
        required:false
    },
    name:{
        type: String,
        required: false,
    },
    numberOfItems:{
        type: Number,
        required: false,
        default:0 
    }
}, {
    collection: 'marksheet',
    timestamps:true
});

InventorySchema.post('save', function(){
    //operations to be done after saving items to inventory
})

var Inventory = mongoose.model('Inventory', InventorySchema)
module.exports = {
    Inventory: Inventory
}