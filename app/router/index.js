var express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json('Welcome to Vedantu');
});

module.exports = router;