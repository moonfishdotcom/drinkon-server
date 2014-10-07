var args = require('yargs').argv;

module.exports = function() {
	return function(err, req, res, next) {
		/*
			Error Hadling. 
			If error thrown with next(<error object>) in route instead of 'throwing' the error.
			Error will be caugt here and stripped of stack traces.
		*/
		if(!err) return next();

		console.error('\n-------------------');
		console.error('-- Error: ', err);
		console.error('-- Url: ', req.originalUrl);
		console.error('-- Time: ', new Date());
		console.error('---------------------');

		if ((args.showErrors || process.env.showErrors)) 
			res.status(500).send(err);
		else
			res.status(500).send('An unexpected error has occured');
	}
}