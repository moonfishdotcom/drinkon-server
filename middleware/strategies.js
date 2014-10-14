var LocalStrategy = require('passport-local').Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy,
	mysql = require('mysql'),
	jwt = require('jwt-simple'),
	secret = "Uber secret",
	tokenValidity = 1,
	moment = require("moment");

var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'drinkonstd2'
});

module.exports = {
	local: local,
	bearer: bearer,
	generateToken: generateToken,
	decodeToken: decodeToken
}

/*
	Define our login strategies and methods for generating access tokens
	This allows us to easily include other login strategies such as FaceBook
	and implement other access methods such as session based.
*/

function generateToken(user) {
	/*
		Generate Json Token
	*/
	var expire = moment().add(tokenValidity, 'day').toISOString();

	var token = jwt.encode({
		customer: user,
		expire: expire
	}, secret);

	return {
		token: token,
		expire: expire,
		customer: user
	};
}

function decodeToken (token, cb) {
	/*
		Decode Json Web token
		Does not check if token has expired, can accept full object sent to client on login or just token
	*/
	token = token.token || token;
	try{
		cb(null, jwt.decode(token, secret));
	}catch(e){
		cb(e, null);
	}
}

function bearer() {
	return new BearerStrategy(function(token, done) {
		/*
				Authenticate user based on Json Web Token
				Token must  be supplied in Authorization header in the following format
				bearer <token>
			*/
		if (!token) return done(null, null, {
			msg: 'Token not provided.'
		});
		decodeToken(token, function(e, decodedToken){
			if(e) return done(e);

			if(moment().isAfter(moment(decodedToken.expire))) return done(null, null, 'Token Expired');

			done(null, decodedToken.customer);
		});
	})
}

function local() {
	return new LocalStrategy(function(username, password, done) {
		/*
				Authenticate a user based on username and password
			*/
		connection.query('SELECT * FROM sys_customers WHERE username = ?', [username], function(err, results) {
			if (err) return done(err);
			if (results.length <= 0) {
				return done(null, null, {
					msg: 'Username or password not recognised.'
				});
			}
			var customer = results[0];
			//ToDo: Add hashing to stored password rather than compare in plain text
			if (customer.password === password) {
				delete customer.password;
				return done(null, customer);
			} else {
				return done(null, null, {
					msg: 'Username or password not recognised.'
				});
			}
		});
	})
}