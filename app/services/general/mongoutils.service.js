
/****
 Commonly Used DB methods kept here 
 ***/


var 
    models = require('../mongoose/models'),
    User = models.User,
     Q = require('q'),
     mongoose = require('mongoose');


/* Used to get user id */

exports.validateUserById = function(_id) {
	 var deferred = Q.defer(); // mongoose.Types.ObjectId(_id)
   
	 User.findOne({ _id: mongoose.Types.ObjectId(_id)}, function(err, foundUser) {
           if(err) 
            deferred.reject(err);
		    if (foundUser) {
		    	
                  deferred.resolve({"user":foundUser}); 
             } else {
                
             	  deferred.resolve(null); 
             }
 
     });        
    return deferred.promise;
}