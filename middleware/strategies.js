var LocalStrategy = require('passport-local').Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy,
  mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'drinkonstd2'
});

module.exports = {
	local: function() {
		return new LocalStrategy(function(username, password, done) {
			console.log('Local', username, password);

      connection.query('SELECT * FROM sys_customers WHERE username = ?', [username], function(err, results) {
        if (err) return done(err);
        if (results.length <= 0) {
          return done(null, null, { msg: 'Username not recognised' });
        }
        var customer = results[0];
        if (customer.password === password) {
          delete customer.password;
          return done(null, customer);
        }
        else {
          return done(null, null, { msg: 'Password not correct' });
        }
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