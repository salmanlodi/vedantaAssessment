var jwt = require('jsonwebtoken'),
    config = require('../../../config');

/* With this method we generate a new token based on payload we want to put on it */
module.exports.issueToken = function(payload) {
    return jwt.sign(
        payload,
        config.secret, 
        { expiresIn: '7d' }         //expiry time for token set to 1 week
    );
};

/* Here we verify that the token we received on a request hasn't be tampered with. */

module.exports.verifyToken = function(token, verified) {
    return jwt.verify(
        token,
        config.secret, {},
        verified
    );
};

