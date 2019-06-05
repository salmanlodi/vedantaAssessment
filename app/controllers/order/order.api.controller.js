const constants = require('../../utils/constants')
const Role = require('../../models/roles').Role;
const Order = require('../../models/order').Order;
const ResourceDeletionError = require('../../errors/general.errors').ResourceDeletionError;
const ResourceNotFoundError = require('../../errors/general.errors').ResourceNotFoundError;
const ResourceAlreadyPresentError = require('../../errors/general.errors').ResourceAlreadyPresentError;
import {
    DatabaseSave
} from '../../utils/enum/db.enum';
const mongoose = require('mongoose');

exports.getOrders = function(req, res, next) {
    let pageNo = req.query[constants.PAGE_NUMBER] ? req.query[constants.PAGE_NUMBER] - 1 : 0;
    let limit = req.query[constants.LIMIT] ? req.query[constants.LIMIT] : 10;
    let offset = pageNo * limit;
    let query = {};
    if(req.body.account){
        query['orderAccount'] = req.body.account
    }
    Order
        .find(query)
        .skip(offset)
        .select('-createdAt -updatedAt')
        .limit(parseInt(limit))
        .then(result => {
            res.send(result);
        })
}

exports.createOrder = function(req, res, next) {
    if (!req.body.order || !req.body.order[constants.ORDER_ACCOUNT] || !req.body.order[constants.ITEM] || !req.body.order[constants.QUANTITY] ) {
        return res.status(400).json({
            msg: constants.PARAMETER_MISSING + ':' + constants.ORDER_ACCOUNT + ' or ' + constants.ITEM + ' or ' + constants.QUANTITY,
            dbStatus: DatabaseSave.FAILED
        })
    } else {
            let data = {
                'orderAccount': req.body.order[constants.ORDER_ACCOUNT],
                'item': req.body.order[constants.ITEM],
                'quantity': req.body.order[constants.QUANTITY]
            }
            let newOrder = new Order(data);
            newOrder.save(function(err, result) {
                if (err) return res.status(400).send({data:err ,msg:'Item out of Stock.! Please come back later',dbStatus:DatabaseSave.ERROR});
                return res.status(201).json({
                    data: result,
                    msg: constants.SUCCESS,
                    dbStatus: DatabaseSave.SUCCESS
                })
            })
    }
}