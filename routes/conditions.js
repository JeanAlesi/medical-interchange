var mapper = require('../lib/model-mapper');
module.exports = function(app) {
	app.get('/conditions', function(req, res) { 
        res.render('conditions/index');
    });
};
