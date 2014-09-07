var express = require('express'),
  app = express(),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(logger('dev'));

var port = process.env.PORT || 8080;

app.use('/location', require('./routes/location'));
app.use('/vendor', require('./routes/vendor'));
app.use('/order', require('./routes/order'));

app.listen(port);

console.log('Here we go on port ' + port + '...');
