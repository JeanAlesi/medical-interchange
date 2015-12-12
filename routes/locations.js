var mapper = require('../lib/model-mapper');
module.exports = function(app) {
    app.get('/locations', function(req, res) {
        res.render('locations/index');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name : 'Locations',
    route : '/locations'
};