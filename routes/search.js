/**
 * Created by ponnusamy on 12/7/2015.
 */
var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/search', function (req, res) {
        res.render('search');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'Search',
    route: '/search'
}