const constants = require('../../utils/constants')
const mongoose = require('mongoose');
const Role = require('../../models/roles').Role;
const User = require('../../models/user').User;
const ResourceAlreadyPresentError = require('../../errors/general.errors').ResourceAlreadyPresentError;
const ResourceCreationError = require('../../errors/general.errors').ResourceCreationError;
const ResourceNotFoundError = require('../../errors/general.errors').ResourceNotFoundError;
import { DatabaseSave } from '../../utils/enum/db.enum';

exports.createRole = (req,res,next) => {
    // Checking if neccesssary parameters are present in the req.body or not
    if (!req.body.role || !req.body.role[constants.ROLE_NAME || !req.body.role[constants.PRIVILEGES]]) {
        res.status(400).json({
            msg: constants.PARAMETER_MISSING
        })
    } else {
        let query = {
            roleName:req.body.role[constants.ROLE_NAME]
        }
        if(req.body.role[constants.ID] != -1){
			updateRole(req.body,res,next);
		} else {
            Role.find(query)
            .then(result => {
                // Checking if result is empty or not.If not present then create the role
                if (result.length === 0) {
                    let data = {
                        roleName: req.body.role[constants.ROLE_NAME],
                        privileges: req.body.role[constants.PRIVILEGES]
                    }
                    let newRole = new Role(data);
                    newRole.save(function(err, result) {
                        if (err) next(err);
                        return res.status(201).json({
                            data: { role: result },
                            msg: constants.SUCCESS,
                            dbStatus: DatabaseSave.SUCCESS
                        })

                    })
                    } else {
                    // If Role is already present 
                    throw new ResourceAlreadyPresentError(result)
                }
            })
            .catch(ResourceAlreadyPresentError , (e) => {
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
}

function updateRole(body,res,next){
		
    let query = {
        _id : mongoose.Types.ObjectId(body.role[constants.ID])
    }

    let update = {
        roleName: body.role[constants.ROLE_NAME]
    }
    
    Role.findOneAndUpdate(query, update)
        .then(result => {
            // Checking if result is empty or not.If not present then create the class
            if (result) {
                    res.status(200).json({
                            msg: constants.UPDATE_SUCCESS,
                            dbStatus: DatabaseSave.SUCCESS
                    })
            } else {
                    // If Class is not already present 
                    return res.status(200).json({
                            msg: constants.PARAMETER_NOT_PRESENT_IN_DATABASE,
                            dbStatus: DatabaseSave.RESOURCE_ALREADY_PRESENT
                    })
            }
    }).catch((err) =>{
            next(err);
    });
}

exports.assignRole = (req,res,next) => {
    if (!req.params[constants.ROLE_ID] || !req.params[constants.USER_ID] ) {
        res.status(400).json({
            msg: constants.PARAMETER_MISSING
        })
    } else {
        let update = {
            roleId : req.params[constants.ROLE_ID]
          }
          let query = {
            _id : req.params[constants.USER_ID]
          }
          User.findOneAndUpdate(query, update).then(result => {
            // Checking if result is empty or not.If not present then create the privilege
            if (result) {
                res.status(200).json({
                    msg: constants.ROLE_ASSIGNMENT,
                    dbStatus: DatabaseSave.SUCCESS
                })
            } else {
                // If Role is not already present 
                return res.status(400).json({
                    msg: constants.PARAMETER_NOT_PRESENT_IN_DATABASE,
                    dbStatus: DatabaseSave.FAILED
                })
            }
          }).catch(e => {
              return next(e);
          })
    }
}
exports.deleteById = (req,res,next) => {
    // Checking if neccesssary parameters are present in the req.body or not
    if (!req.params[constants.ROLE_ID]) {
        res.status(400).json({
            msg: constants.PARAMETER_MISSING
        })
    } else {
		let query = {
			_id : req.params[constants.ROLE_ID]
		}
		Role.findById(query).then(data => {
			if(data){
                data.remove().then(function(x) {
						return res.status(200).json({
                            msg:constants.DELETION_SUCCESS,
                            dbStatus:DatabaseSave.SUCCESS
                        });                    
                })
                .catch(e =>{ next(e) })
			} else {
				throw new ResourceNotFoundError()       
			}
		}).catch(ResourceNotFoundError , (e) => {
			res.status(404).json({
                msg:constants.RESOURCE_NOT_FOUND,
                dbStatus:DatabaseSave.ERROR
            })
        })
        .catch(e => {next(e)})
   
    }
}


exports.getRoles =(req,res,next)=>{

    /* Get all the classes  esent in the 'Class' collection */
    Role.find()
    .populate({
        path: 'privileges',
        model: 'Privilege',
        select: 'privilegeName',
    })
    .then(data => {
        if(data){
            return res.status(200).json({
                msg: constants.GET_SUCCESS,
                data: data,
                dbStatus: DatabaseSave.SUCCESS
            })
        }
        else{
            throw new ResourceNotFoundError();
        }
    })
    .catch(ResourceNotFoundError, (e) => {
        res.status(404).json({
            msg:constants.RESOURCE_NOT_FOUND,
            dbStatus: DatabaseSave.ERROR
        });
    })
    .catch(e => {
        next(e);
    })
}