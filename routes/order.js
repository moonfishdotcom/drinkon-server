var express = require('express'),
  router = express.Router(),
  mysql = require('mysql'),
  _ = require('lodash');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'drinkon'
});

router.get('/', function(req, res) {
  connection.query('CALL GetOrders();', function (err, rows) {
    if (err) {
      res.status(500).send({ error: err });
    }
    else {
      res.status(200).json(rows[0]);
    }
  });
});

router.post('/', function(req, res) {
  connection.query('CALL BangInOrder();', function(err, rows) {
    if (err) {
      res.status(500).send({ error: err });
    }
    else {
      res.status(200).send({ message: 'Nice one' });
    }
  });
});

module.exports = router;