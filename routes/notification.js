var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  mysql = require('mysql'),
  _ = require('lodash'),
  connection = require('./dbConnection');

router.get('/', function(req, res, next) {

  var notifications = {
    notifications: [
      {
        customer_id: 4,
        vendor_id: 1,
        title: 'BOGOF!',
        message: 'Buy one pint of Fosters and get one free',
        expires: '2014-10-17T21:30:00'
      },
      {
        customer_id: 4,
        vendor_id: 2,
        title: 'Cocktails for £3.00!',
        message: 'It\'s cocktail night - any cocktail costs £3.00!',
        expires: '2014-10-17T23:30:00'
      }
    ]
  };

  res.json(notifications);
});

module.exports = router;
