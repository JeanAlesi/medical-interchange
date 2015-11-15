var mapper = require('../lib/model-mapper');
module.exports = function (app) {
    app.get('/beneficiaries', function (req, res) {
        res.render('services/beneficiaries/index');
    });
};

//Used to build the index page. Can be safely removed!
module.exports.meta = {
    name: 'Beneficiaries',
    route: '/beneficiaries'
};