var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/about', function (req, res) {
        res.render('about');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'About',
    route: '/about'
};