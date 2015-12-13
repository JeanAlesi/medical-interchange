var mapper = require('../lib/model-mapper');
module.exports = function(app) {
    app.get('/locations', function(req, res) {
        res.render('locations/index');
    });
};