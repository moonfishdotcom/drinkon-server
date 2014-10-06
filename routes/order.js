var express = require('express'),
  router = express.Router(),
  mysql = require('mysql'),
  _ = require('lodash');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'drinkonstd'
});

router.get('/:orderId', function (req, res) {
  var order = null;
  connection.query('CALL get_order_header(?);', [req.params.orderId], function (err, headers) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err });
    }
    else {
      order = headers[0][0];
      connection.query('CALL get_order_lines(?);', [req.params.orderId], function (err, lines) {
        if (err) {
          console.log(err);
          res.status(500).send({ error: err });
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

router.get('/user/:userId', function(req, res) {
  connection.query('CALL get_orders_for_user (?);', [req.params.userId], function (err, headers) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err });
    }
    else {
      res.status(200).send(headers[0]);
    }
  });
});

router.post('/', function (req, res) {
  connection.query('CALL create_order(?,?);', [req.body.vendorId, req.body.customerId], function (err, rows) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err });
    }
    else {
      res.status(200).send(rows[0]);
    }
  });
});

router.post('/:orderId/line', function (req, res) {
  console.log(req.body);
  connection.query('CALL add_order_line(?,?,?,?);', [
      req.params.orderId,
      req.body.productId,
      req.body.measureId,
      req.body.quantity],
    function (err, rows) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: err });
      }
      else {
        res.status(200).send(rows[0]);
      }
    });
});

router.put('/:orderId/line/:lineId', function(req, res) {
  connection.query('CALL update_order_line(?,?);', [
    req.params.lineId,
    req.body.quantity],
    function(err, rows) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: err });
      }
      else {
        res.status(200).send(rows[0]);
      }
    });
});

router.delete('/:orderId/line/:lineId', function(req, res) {
  connection.query('CALL delete_order_line(?);', [req.params.lineId],
    function(err, rows) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: err });
      }
      else {
        res.status(200).send(rows[0]);
      }
    });
})

module.exports = router;