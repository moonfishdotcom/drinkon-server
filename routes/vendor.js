var express = require('express'),
  router = express.Router(),
  mysql = require('mysql'),
  _ = require('lodash'),
  connection = require('./dbConnection');

function transformVendorRecord(record) {
  return {
    id: record.vendor_id,
    name: record.vendor_name,
    address: {
      line1: record.vendor_addr1,
      line2: record.vendor_addr2,
      line3: record.vendor_addr3,
      line4: record.vendor_addr4,
      postcode: record.vendor_postcode
    },
    phone: record.vendor_phone,
    fax: record.vendor_fax,
    email: record.vendor_email,
    locationId: record.location_id,
    locationName: record.location_name,
    image: record.vendor_image,
    description: {
      line1: record.vendor_line1,
      line2: record.vendor_line2,
      line3: record.vendor_line3
    },
    distance: record.vendor_distance,
    sells: {
      food: record.vendor_sells_food,
      drink: record.vendor_sells_drink,
      alcohol: record.vendor_sells_alcohol
    }
  };
}

router.get('/', function(req, res, next) {
  connection.query('CALL get_vendor(null);', function (err, row) {
    if (row && row.length > 0 && row[0].length > 0) {
      var vendors = _.map(row[0], transformVendorRecord);
      res.json(vendors);
    }
    else {
      next({error: "No values for vendor"});
    }
  })
});

router.get('/:vendorId', function (req, res, next) {
  connection.query('CALL get_vendor(?);', [req.params.vendorId], function (err, row) {
    if (row && row.length > 0 && row[0].length > 0) {
      res.json(transformVendorRecord(row[0][0]));
    }
    else {
      next({error: "No values for vendor"});
    }
  })
});

function mapToProductTypeHeader(record) {
  return {
    id: record.product_type_id,
    name: record.product_type_name,
    image: record.product_type_image_name
  };
}

function mapToProductHeader(record) {
  return {
    id: record.product_id,
    name: record.product_name,
    image: record.product_image_name
  };
}

function concatIdAndNameForEquality(record) {
  return record.id + '|' + record.name;
}

router.get('/:vendorId/product', function (req, res, next) {
  connection.query('CALL get_vendor_products(?);', [req.params.vendorId], function (err, row) {
    var records = row[0];
    var returnVal = {
      productTypes: []
    };

    _.forEach(_.unique(_.map(records, mapToProductTypeHeader), concatIdAndNameForEquality), function (productType) {
      var productType = {
        id: productType.id,
        name: productType.name,
        image: productType.image,
        products: []
      };

      _.forEach(_.unique(_.map(_.where(records, { 'product_type_name': productType.name }), mapToProductHeader), concatIdAndNameForEquality), function (product) {
        var product = {
          id: product.id,
          name: product.name,
          image: product.image,
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
