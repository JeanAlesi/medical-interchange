var mapper = require('../lib/model-mapper');
module.exports = function(app) {
	app.get('/conditions', function(req, res) { 
        res.render('conditions/index');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
 name : 'Conditions',
 route : '/conditions'
};