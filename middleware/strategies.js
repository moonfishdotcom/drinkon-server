var LocalStrategy = require('passport-local').Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = {
	local: function() {
		return new LocalStrategy(function(username, password, done) {
			console.log('Local', username, password)
			return done(null, {
				username: 'test',
				forename: 'joe',
				surname: 'blogs'
			});
			//Authenticate user against details within database
		})
	},
	bearer: function() {
		return new BearerStrategy(function(token, done) {
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
			//Authenticate user from web token
		})
	}
}