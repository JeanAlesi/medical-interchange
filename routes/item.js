var Item = require('../models/item'),
    fs = require("fs"),
    mapper = require('../lib/model-mapper');

module.exports = function(app) {

    app.param('itemId', function(req, res, next, id) {
        Item.findById(id, function(err, item) {
            if (err) {
                next(err);
            } else {
                res.locals.item = item;
                next();
            }
        });
    });

    app.get('/items', function(req, res) {
        Item.find({}, function(err, items) {
            res.render('item/index', { items : items });
        });
    });

    app.get('/items/create', function(req, res) {
        res.render('item/create', { item : new Item() });
    });

    app.post('/items/create', function(req, res) {
        var item = new Item(req.body);

        item.save(function(err) {
            if (err) {
                res.render('item/create', {
                    item : item
                });
            } else {
                res.redirect('/items');
            }
        });
    });

    app.get('/items/:itemId/edit', function(req, res) {
        res.render('item/edit');
    });

    app.post('/items/:itemId/edit', function(req, res) {
        mapper.map(req.body).to(res.locals.item);

        res.locals.item.save(function(err) {
            if (err) {
                res.render('item/edit');
            } else {
                res.redirect('/items');
            }
        });
    });

    app.post('/items/:itemId/uploadimage',function(req,res) {
        fs.readFile(req.files.displayImage.path, function (err, data) {
            var itemId = req.params.itemId;
            var newPath = __dirname + "/../uploads/" + itemId;
            fs.writeFile(newPath, data, function (err) {
                res.redirect("back");
            });
        });
    });

    app.get('/items/:itemId/detail', function(req, res) {
        res.render('item/detail');
    });

    app.get('/items/:itemId/delete', function(req, res) {
        res.render('item/delete');
    });

    app.post('/items/:itemId/delete', function(req, res) {
        Item.remove({ _id : req.params.itemId }, function(err) {
            res.redirect('/items');
        });
    });
}

// Used to build the index page. Can be safely removed!
module.exports.meta = {
    name : 'Item',
    route : '/items'
}
