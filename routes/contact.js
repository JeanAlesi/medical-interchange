var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/contact', function (req, res) {
        res.render('contact');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'Contact',
    route: '/contact'
};