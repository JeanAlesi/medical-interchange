/**
 * Created by arleena.faith on 11/15/2015.
 */

var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/coverage', function (req, res) {
        res.render('coverage/index');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'Coverage',
    route: '/coverage'
};