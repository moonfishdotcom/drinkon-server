var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  jwt = require('jwt-simple'),
  secret = "Uber secret",
  mysql = require('mysql'),
  moment = require('moment'),
  connection = require('./dbConnection');

router.post('/login', function (req, res, next) {

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    else if (user) {
      var token = jwt.encode({
        user_id: user.id,
        expires: moment().add(1, 'day').toISOString()
      }, secret);

      res.send({
        token: token,
        user: user
      });
    }
    else {
      res.status(401).send(info);
    }
  })(req, res, next);
});

router.post('/register', function(req, res, next) {
  // check for existing user first
  connection.query('SELECT id FROM sys_customers WHERE username = ?', [req.body.username], function(err, rows) {
    if (err) {
      next(err);
    }
    else if (rows.length > 0) {
      res.status(409).send({msg: 'Username already exists'});
    }
    else {
      connection.query('INSERT INTO sys_customers (username, password, display_name) VALUES (?, ?, ?)', [req.body.username, req.body.password, req.body.displayName], function(err, rows) {
        if (err) {
          next(err);
        }
        else {
          res.status(200).send();
        }
      })
    }
  });

});

module.exports = router;
