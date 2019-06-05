var _ = require('lodash');

module.exports =
  _.template(
    '<body>'+
    '<p>' + "Dear <%= name %>," + '</p>' +
    '<br>' +
    '<p>' +
        "You have requested to have your password reset for your account at vedantu.in" +
    '</p>'  +
    '<p>' + "Please visit this url to reset your password:" + '</p>' +
    '<p>' + "<%= url %>" + '</p>' +
    '<strong>' + "If you didn't make this request, you can ignore this email." + '</strong>' +
    '<br>' +
    '<br>' +
    '<p>' + "The Vedantu Support Team" + '</p>' +
    '</body>'
    );
