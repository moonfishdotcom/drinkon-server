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

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
    //Handler for once user has successfully logged in to generate token
    if(err){
      return next(err);
    }else if(user){
      res.send(middleware.strategies.generateToken(user));
    }else{
      res.status(403).send(info);
    }
	})(req, res, next);
});

app.use(function(req, res, next) {
	passport.authenticate('bearer', function(err, user, info) {
    //Global auth handler to limit access dependant on a valid access token
    if(user){
      req.user = user;
      next();
    }else{
      res.status(403).send(info || "Unexpected Error");
    }
	})(req, res, next);
});

app.use('/location', require('./routes/location'));
app.use('/vendor', require('./routes/vendor'));
app.use('/order', require('./routes/order'));

app.get('/test', function(req, res){
  res.send(req.user);
})

app.use(middleware.errorHandler());

app.listen(port);

console.log('Here we go on port ' + port + '...');