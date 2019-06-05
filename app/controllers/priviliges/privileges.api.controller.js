const constants = require('../../utils/constants')
const Privilege = require('../../models/privileges').Privilege;
const Role = require('../../models/roles').Role;
const ResourceDeletionError = require('../../errors/general.errors').ResourceDeletionError;
const ResourceNotFoundError = require('../../errors/general.errors').ResourceNotFoundError;
const ResourceAlreadyPresentError = require('../../errors/general.errors').ResourceAlreadyPresentError;
import {
    DatabaseSave
} from '../../utils/enum/db.enum';
const mongoose = require('mongoose');

exports.createPrivilege = function(req, res, next) {
    // If neccessary parameters are missing then send "Error missing" reply
    if ((!req.body.privilege && req.body.privilege[constants.PRIVILEGE_NAME]) || !req.body.privilege[constants.ID]) {
        res.status(400).json({
            msg: constants.PARAMETER_MISSING + ':' + constants.PRIVILEGE_NAME + ' or ' + constants.ID,
            dbStatus: DatabaseSave.FAILED
        })
    } else {
        let id = req.body.privilege[constants.ID];
        //if id = -1 then create orelse update the document
        if (id && id == -1) {
            let privilegeName = req.body.privilege[constants.PRIVILEGE_NAME]
            let slug = req.body.privilege[constants.SLUG] ? req.body.privilege[constants.SLUG] : '';
            // Check if privilege already exists in 'privilege' collection
            let query = {
                privilegeName: privilegeName
            }
            Privilege.find(query).then(result => {
                    // Checking if result is empty or not.If not present then create the privilege
                    if (result.length === 0) {
                        let data = {
                            privilegeName: privilegeName,
                            slug: slug
                        }
                        let newPrivilege = new Privilege(data);
                        newPrivilege.save(function(err, result) {
                            if (err) next(err);
                            return res.status(201).json({
                                data: {
                                    privilege: result
                                },
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
        } else {
            updatePrivilege(req.body, res, next);
        }
    }
}

/* local function to update the privilege*/
function updatePrivilege(req, res, next) {
    let update = {
        privilegeName: req.privilege[constants.PRIVILEGE_NAME]
    }
    let query = {
        _id: req.privilege[constants.ID]
    }
    Privilege.findOneAndUpdate(query, update).then(result => {
        // Checking if result is empty or not.If not present then create the privilege
        if (result) {
            res.status(200).json({
                msg: constants.UPDATE_SUCCESS,
                dbStatus: DatabaseSave.SUCCESS
            })
        } else {
            // If Privilege is not already present 
            return res.status(400).json({
                msg: constants.PARAMETER_NOT_PRESENT_IN_DATABASE,
                dbStatus: DatabaseSave.FAILED
            })
        }
    }).catch(e => {
        return next(e);
    })
}

/* Get all the Privileges */

exports.getAllPrivileges = (req, res, next) => {

    /* Get all the Privileges present in the 'Privilege' collection */
    Privilege.find().then(data => {
            if (data) {
                return res.status(200).json({
                    msg: constants.GET_SUCCESS,
                    data: data,
                    dbStatus: DatabaseSave.SUCCESS
                })
            } else {
                throw new ResourceNotFoundError();
            }
        })
        .catch(ResourceNotFoundError, (e) => {
            res.status(404).json({
                msg: constants.RESOURCE_NOT_FOUND,
                dbStatus: DatabaseSave.ERROR
            });
        })
        .catch(e => {
            next(e);
        })
}

/* Delete privilege */

exports.deleteById = (req, res, next) => {
    // If neccessary parameters are missing then send "Error missing" reply
    if (!req.params[constants.PRIVILEGE_ID]) {
        res.status(400).json({
            msg: constants.PARAMETER_MISSING + ':' + constants.PRIVILEGE_ID,
            dbStatus: DatabaseSave.FAILED
        })
    } else {
        let query = {
            _id: req.params[constants.PRIVILEGE_ID]
        }
        Privilege.findById(query).then(data => {
                if (data) {
                    data.remove().then(function(x) {
                            return res.status(200).json({
                                msg: constants.DELETION_SUCCESS,
                                dbStatus: DatabaseSave.SUCCESS
                            });
                        })
                        .catch(e => {
                            next(e)
                        })
                } else {
                    throw new ResourceNotFoundError()
                }
            }).catch(ResourceNotFoundError, (e) => {
                res.status(404).json({
                    msg: constants.RESOURCE_NOT_FOUND,
                    dbStatus: DatabaseSave.ERROR
                })
            })
            .catch(e => {
                next(e)
            })
    }
}

/* Grant specific privilege to a role */
exports.updatePrivilege = (req, res, next) => {
    // If neccessary parameters are missing then send "Error missing" reply
    if ((!req.params[constants.ROLE_ID]) || !req.body.privileges) {
        res.status(400).json({
            msg: constants.PARAMETER_MISSING + ':' + constants.PRIVILEGE_NAME + ' or ' + constants.ID,
            dbStatus: DatabaseSave.FAILED
        })
    } else {
        let privileges = req.body.privileges;
        let roleQuery = {
            '_id': req.params[constants.ROLE_ID]
        }
        Role.findOneAndUpdate(
                roleQuery, {
                    $set: {
                        privileges: []
                    }
                }
            )
            .then((role) => {
                if (role) {
                    Role.update(roleQuery, {
                            $push: {
                                privileges: privileges
                            }
                        }).then((roles) => {
                            res.status(202).json({
                                msg: constants.UPDATE_SUCCESS,
                                dbStatus: DatabaseSave.SUCCESS
                            })
                        })
                        .catch(err => {
                            next(err)
                        })
                } else {
                    res.status(400).send({
                        msg: constants.USER_NOT_FOUND + '/' + constants.ALREADY_ASSIGNED,
                        dbStatus: DatabaseSave.ERROR
                    })
                }

            })
    }
}

/* Revoke specific privilege to a role */
exports.forbidPrivilege = (req, res, next) => {
    // If neccessary parameters are missing then send "Error missing" reply
    if ((!req.params[constants.ROLE_ID]) || !req.params[constants.PRIVILEGE_ID]) {
        res.status(400).json({
            msg: constants.PARAMETER_MISSING + ':' + constants.PRIVILEGE_NAME + ' or ' + constants.ID,
            dbStatus: DatabaseSave.FAILED
        })
    } else {
        let roleQuery = {
            '_id': req.params[constants.ROLE_ID],
            'privileges': {
                $elemMatch: {
                    $eq: mongoose.Types.ObjectId(req.params[constants.PRIVILEGE_ID])
                }
            }
        }
        Role.findOneAndUpdate(
                roleQuery, {
                    $pull: {
                        'privileges': mongoose.Types.ObjectId(req.params[constants.PRIVILEGE_ID])
                    }
                }
            )
            .then((role) => {
                if (role) {
                    res.status(201).json({
                        msg: 'constants.UPDATE_SUCCESS',
                        data: 'role:' + req.params[constants.ROLE_ID] + ' has been rovoked access to privilege:' + req.params[constants.PRIVILEGE_ID],
                        dbStatus: DatabaseSave.SUCCESS
                    })
                } else {
                    throw new ResourceNotFoundError()
                }

            })
            .catch(ResourceNotFoundError => {
                res.status(404).json({
                    msg: constants.RESOURCE_NOT_FOUND,
                    dbStatus: DatabaseSave.ERROR
                })
            })
            .catch(e => {
                next(e)
            })


    }
}