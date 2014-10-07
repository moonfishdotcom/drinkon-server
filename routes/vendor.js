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

router.get('/:vendorId', function (req, res, next) {
  connection.query('CALL GetVendor(?);', [req.params.vendorId], function (err, row) {
    if (row && row.length > 0 && row[0].length > 0) {
      var record = row[0][0];
      var returnVal = {
        id: record.id,
        name: record.vendor_name,
        address: {
          line1: record.vendor_addr1,
          line2: record.vendor_addr2,
          line3: record.vendor_addr3,
          line4: record.vendor_addr4,
          postcode: record.vendor_postcode,
        },
        phone: record.vendor_phone,
        fax: record.vendor_fax,
        email: record.vendor_email,
        locationId: record.location_id,
        image: record.vendor_image,
        description: {
          line1: record.vendor_description_line1,
          line2: record.vendor_description_line2,
          line3: record.vendor_description_line3
        },
        distance: record.distance,
        sells: {
          food: record.sellsFood,
          drink: record.sellsDrink
        }
      };
      res.json(returnVal);
    }
    else {
      next({error: "No values for vendor"});
    }
  })
});

function mapToProductTypeHeader(record) {
  return {
    id: record.product_type_id,
    name: record.product_type_name
  };
}

function mapToProductHeader(record) {
  return {
    id: record.product_id,
    name: record.product_name
  };
}

function concatIdAndNameForEquality(record) {
  return record.id + '|' + record.name;
}

router.get('/:vendorId/product', function (req, res, next) {
  connection.query('CALL GetVendorProducts(?);', [req.params.vendorId], function (err, row) {
    var records = row[0];
    var returnVal = {
      productTypes: []
    };

    _.forEach(_.unique(_.map(records, mapToProductTypeHeader), concatIdAndNameForEquality), function (productType) {
      var productType = {
        id: productType.id,
        name: productType.name,
        products: []
      };

      _.forEach(_.unique(_.map(_.where(records, { 'product_type_name': productType.name }), mapToProductHeader), concatIdAndNameForEquality), function (product) {
        var product = {
          id: product.id,
          name: product.name,
          measures: []
        };

        _.forEach(_.where(records, { 'product_type_name': productType.name, 'product_name': product.name}), function (productMeasure) {
          product.measures.push({
            id: productMeasure.product_measure_id,
            name: productMeasure.product_measure_name,
            unitPrice: productMeasure.product_unit_price
          });
        });

        productType.products.push(product);
      });

      returnVal.productTypes.push(productType);
    });

    res.json(returnVal);
  });
});


module.exports = router;
