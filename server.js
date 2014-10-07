var express = require('express'),
  app = express(),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  middleware = require(__dirname + '/middleware/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(logger('dev'));
app.use(middleware.https());


var port = process.env.PORT || 8080;

app.use('/location', require('./routes/location'));
app.use('/vendor', require('./routes/vendor'));
app.use('/order', require('./routes/order'));

app.use(middleware.errorHandler());

app.listen(port);

console.log('Here we go on port ' + port + '...');
