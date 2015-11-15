var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/services', function (req, res) {
        res.render('services/index');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'Services',
    route: '/services'
};