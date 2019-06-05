const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OrderSchema = new Schema({
    orderAccount:{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'account'
    },
    item: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'inventory'
    },
    quantity:{
        type:Number,
        default:1
    },
    status: {
        type: String,
        default: 'Order Received'
    }
}, {
    collection: 'Order',
    timestamps: true
});

OrderSchema.pre('save', function(next) {
    //pre save operations can be performed here like checking of if ordered item is in stock.
    const order = this.toObject();
    const Item = require('./inventory').Inventory;
    let query = {
        '_id':order.item
    }
    Item.findById(query).then((item)=>{
        if(item.numberOfItems > 0 && order.quantity < item.numberOfItems){
            return next();
        } else {
            let err = new Error('Item currently out of stock. Please come back later')
            console.log(err);
            return next(err);
        }
    })
})



let Order = mongoose.model('Order', OrderSchema)

module.exports = {
    Order: Order
}