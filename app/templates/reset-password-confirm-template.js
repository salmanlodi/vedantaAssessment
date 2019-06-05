var _ = require('lodash');

module.exports =
  _.template(
    '<body>' +
    '<p>' + "Hi <%= name %>," + '</p>' +
    '<p></p>' +
    '<p>' + "This is a confirmation that the password for your account has just been changed" + '</p>' +
    '<br>' +
    '<br>' +
    '<p>' + "Vedantu Support Team" + '</p>' + 
    '</body>'
    );
