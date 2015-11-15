var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/donors', function (req, res) {
        res.render('services/donors/index');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'Donors',
    route: '/donors'
};