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

router.get('/:orderId', function (req, res, next) {
  var order = null;
  connection.query('CALL GetOrderHeader(?);', [req.params.orderId], function (err, headers) {
    if (err) {
      next({ error: err });
    }
    else {
      order = headers[0][0];
      connection.query('CALL GetOrderLines(?);', [req.params.orderId], function (err, lines) {
        if (err) {
          next({ error: err });
        }
        else {
          if (lines.length > 0) {
            order.lines = lines[0];
          }
          else {
            order.lines = [];
          }
          res.status(200).send(order);
        }
      })
    }
  })
});

router.get('/user/:userId', function(req, res, next) {
  connection.query('CALL GetOrdersForUser(?);', [req.params.userId], function (err, headers) {
    if (err) {
      next({ error: err });
    }
    else {
      res.status(200).send(headers[0]);
    }
  });
});

router.post('/', function (req, res, next) {
  connection.query('CALL CreateOrder(?,?);', [req.body.vendorId, req.body.customerName], function (err, rows) {
    if (err) {
      next({ error: err });
    }
    else {
      res.status(200).send(rows[0]);
    }
  });
});

router.post('/:orderId/line', function (req, res, next) {
  connection.query('CALL AddLineToOrder(?,?,?,?);', [
      req.params.orderId,
      req.body.productId,
      req.body.measureId,
      req.body.quantity],
    function (err, rows) {
      if (err) {
        next({ error: err });
      }
      else {
        res.status(200).send(rows[0]);
      }
    });
});

module.exports = router;