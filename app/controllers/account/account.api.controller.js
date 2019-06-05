const constants = require('../../utils/constants')
const Role = require('../../models/roles').Role;
const Account = require('../../models/account').Account;
const ResourceDeletionError = require('../../errors/general.errors').ResourceDeletionError;
const ResourceNotFoundError = require('../../errors/general.errors').ResourceNotFoundError;
const ResourceAlreadyPresentError = require('../../errors/general.errors').ResourceAlreadyPresentError;
import {
    DatabaseSave
} from '../../utils/enum/db.enum';
const mongoose = require('mongoose');

exports.getAccounts = function(req, res, next) {
    let pageNo = req.query[constants.PAGE_NUMBER] ? req.query[constants.PAGE_NUMBER] - 1 : 0;
    let limit = req.query[constants.LIMIT] ? req.query[constants.LIMIT] : 10;
    let offset = pageNo * limit;
    Account
        .find()
        .skip(offset)
        .select('-createdAt -updatedAt')
        .limit(parseInt(limit))
        .then(result => {
            res.send(result);
        })
}

exports.createAccount = function(req, res, next) {
    if (!req.body.account || !req.body.account[constants.USER_NAME] || !req.body.account[constants.NAME] || !req.body.account[constants.TYPE]) {
        return res.status(400).json({
            msg: constants.PARAMETER_MISSING + ':' + constants.USER_NAME + ' or ' + constants.USER_NAME + ' or ' + constants.TYPE,
            dbStatus: DatabaseSave.FAILED
        })
    } else {
        let query = {
            'username': req.body.account[constants.USER_NAME]
        }
        Account.findOne(query).then(result => {
                // Checking if result is empty or not.If not present then create
                if (!result) {
                    let data = {
                        username: req.body.account[constants.USER_NAME],
                        name: req.body.account[constants.NAME],
                        type: req.body.account[constants.TYPE]
                    }
                    let newAccount = new Account(data);
                    newAccount.save(function(err, result) {
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