var args = require('yargs').argv;

module.exports = function() {
	return function(req, res, next) {
		/*
			Enforce HTTPS Middleware
		*/
		if (!req.secure && (args.secure || process.env.secure)) {
			res.status(405).send('Method Not allowed. Use HTTPS.');
		} else {
			next();
		}
	}
}