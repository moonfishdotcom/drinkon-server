var express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	middleware = require(__dirname + '/middleware/index'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());
app.use(logger('dev'));
app.use(middleware.https());
app.use(passport.initialize());

passport.use(new LocalStrategy(function(username, password, done) {
	console.log('Local', username, password)
	return done(null, {
		username: 'test',
		forename: 'joe',
		surname: 'blogs'
	});
	//Authenticate user against details within database
}));

passport.use(new BearerStrategy(function(token, done) {
	console.log('bearer', token)
	if (token && token == "test") {
		return done(null, {
			username: 'test',
			forename: 'joe',
			surname: 'blogs'
		});
	} else {
		return done('no no no')
	}
}))
var port = process.env.PORT || 8080;

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);

		if (!user) {
			return res.status(401).send('Error');
		}


		//provide Token
		var token = "sfddghdxhfgszfgxcjhzdh";
		res.json({
			token: token
		});
	})(req, res, next);
})

app.use(function(req, res, next) {
	passport.authenticate('bearer', function(err, user, info) {
		if (err) 
			res.status(401).send('nope')
		else
			next();
	})(req, res, next);
})
app.use('/location', require('./routes/location'));
app.use('/vendor', require('./routes/vendor'));
app.use('/order', require('./routes/order'));
app.get('/test', function(req, res) {
	res.send('YAY!');
})

app.use(middleware.errorHandler());

app.listen(port);

console.log('Here we go on port ' + port + '...');