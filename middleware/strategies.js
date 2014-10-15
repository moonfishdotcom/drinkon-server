var LocalStrategy = require('passport-local').Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy,
  jwt = require('jwt-simple'),
  secret = 'Uber secret',
  mysql = require('mysql'),
  moment = require('moment');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'drinkonstd2'
});

module.exports = {
	local: function() {
		return new LocalStrategy(function(username, password, done) {
      connection.query('SELECT id, username, password, display_name FROM sys_customers WHERE username = ?', [username], function(err, customers) {
        if (err) {
          return done(err);
        }

        if (customers.length <= 0) {
          return done(null, false, { msg: 'Username not recognised' });
        }

        var customer = customers[0];
        if (customer.password === password) {
          delete customer.password;
          return done(null, customer);
        }
        else {
          return done(null, false, { msg: 'Password not correct' });
        }
      });
		})
	},

	bearer: function() {
		return new BearerStrategy(function(token, done) {
      var token = jwt.decode(token, secret);
      if (moment(token.expires).isBefore()) {
        return done(null, false);
      }
      else {
        // TODO: We could check for status of user here - active, banned, etc...
        connection.query('SELECT id, username, password, display_name FROM sys_customers WHERE id = ?', [token.user_id], function(err, customers) {
          if (err) {
            return done(err);
          }

          if (customers.length <= 0) {
            return done(null, false);
          }

          var customer = customers[0];
          if (customer.id === token.user_id) {
            delete customer.password;
            return done(null, customer);
          }
          else {
            return done(null, false);
          }
        });
      }
		});
	}
};
