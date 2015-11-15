var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/membership', function (req, res) {
        res.render('membership');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'Membership',
    route: '/membership'
};