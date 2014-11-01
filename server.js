var express = require('express'),
  app = express(),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  middleware = require(__dirname + '/middleware/index'),
  passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(logger('dev'));
app.use(middleware.https());
app.use(passport.initialize());

passport.use(middleware.strategies.local());
passport.use(middleware.strategies.bearer());

var port = process.env.PORT || 8080;

app.use('/', require('./routes/auth'));

//app.use(function(req, res, next) {
//	passport.authenticate('bearer', function(err, user, info) {
//		//replace with authorization middleware for selected access type
//		if (err || !user)
//			res.status(401).send('nope')
//		else{
//			req.user = user;
//			next();
//		}
//	})(req, res, next);
//})

app.use('/location', require('./routes/location'));
app.use('/vendor', require('./routes/vendor'));
app.use('/order', require('./routes/order'));
app.use('/notification', require('./routes/notification'));

app.use(middleware.errorHandler());

app.listen(port);

console.log('Here we go on port ' + port + '...');