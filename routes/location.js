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

router.get('/', function(req, res) {
  connection.query('CALL get_locations();', function(err, rows) {
    if (err) {
      res.status(500).send({error: err});
    }
    else {
      res.json(rows);
    }
  })
});

router.get('/:locationId', function(req, res) {
  connection.query('CALL get_location_and_vendors(?);', [req.params.locationId], function(err, rows) {
    var records = rows[0]; // not interested in query information
    if (records.length > 0) {
      // Transform the flat row data into more structured json
      var location = _.first(records);
      var returnVal = {
        id: location.location_id,
        name: location.location_name,
        vendors: []
      };
      if (location.vendor_id) {
        returnVal.vendors = _.map(records, function(record) {
          return {
            id: record.vendor_id,
            name: record.vendor_name,
            distance: record.vendor_distance,
            sells: {
              drink: record.vendor_sellsdrink,
              food: record.vendor_sellsfood
            }
          };
        })
      };
      res.json(returnVal);
    }
    else {
      res.status(500).send({error: 'No records returned'});
    }
  })
});


module.exports = router;
