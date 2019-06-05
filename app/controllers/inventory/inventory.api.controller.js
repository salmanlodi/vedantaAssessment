const constants = require('../../utils/constants')
const Role = require('../../models/roles').Role;
const Inventory = require('../../models/inventory').Inventory;
const ResourceDeletionError = require('../../errors/general.errors').ResourceDeletionError;
const ResourceNotFoundError = require('../../errors/general.errors').ResourceNotFoundError;
const ResourceAlreadyPresentError = require('../../errors/general.errors').ResourceAlreadyPresentError;
import {
    DatabaseSave
} from '../../utils/enum/db.enum';
const mongoose = require('mongoose');

exports.getInventoryItems = function(req, res, next) {
    let pageNo = req.query[constants.PAGE_NUMBER] ? req.query[constants.PAGE_NUMBER] - 1 : 0;
    let limit = req.query[constants.LIMIT] ? req.query[constants.LIMIT] : 10;
    let offset = pageNo * limit;
    Inventory
        .find()
        .skip(offset)
        .select('-createdAt -updatedAt')
        .limit(parseInt(limit))
        .then(result => {
            res.send(result);
        })
}

exports.createItem = function(req, res, next) {
    console.log(req.body.inventory);
    console.log(req.body.inventory[constants.PRICE]);
    console.log(req.body.inventory[constants.SELLER]);
    console.log(req.body.inventory[constants.NUMBER_OF_ITEMS]);
    console.log(req.body.inventory[constants.NAME]);
    
    if (!req.body.inventory || !req.body.inventory[constants.PRICE] || !req.body.inventory[constants.SELLER] || !req.body.inventory[constants.NAME] || !req.body.inventory[constants.NUMBER_OF_ITEMS]) {
        return res.status(400).json({
            msg: constants.PARAMETER_MISSING + ':' + constants.PRICE + ' or ' + constants.NAME + ' or ' + constants.NUMBER_OF_ITEMS +','+ constants.SELLER,
            dbStatus: DatabaseSave.FAILED
        })
    } else {
        let query = {
            'seller': mongoose.Types.ObjectId(req.body.inventory[constants.SELLER]),
            'name': req.body.inventory[constants.NAME]
        }
        Inventory.findOne(query).then((result) => {
                // Checking if result is empty or not.If not present then create
                if (!result) {
                    let data = {
                        'seller': req.body.inventory[constants.USER_NAME],
                        'name': req.body.inventory[constants.NAME],
                        'price': req.body.inventory[constants.TYPE],
                        'numberOfItems': req.body.inventory[constants.NUMBER_OF_ITEMS]
                    }
                    let newItem = new Inventory(data);
                    newItem.save(function(err, result) {
                        if (err) return next(err);
                        return res.status(201).json({
                            data: result,
                            msg: constants.SUCCESS,
                            dbStatus: DatabaseSave.SUCCESS
                        })

                    })
                } else {
                    // If Privilege is already present 
                    throw new ResourceAlreadyPresentError(result)
                }
            })
            .catch(ResourceAlreadyPresentError, (e) => {
                res.status(400).json({
                    msg: constants.RESOURCE_ALREADY_PRESENT,
                    dbStatus: DatabaseSave.RESOURCE_ALREADY_PRESENT,
                    data: e.message
                })
            })
            .catch(e => {
                return next(e);
            })
    }
}