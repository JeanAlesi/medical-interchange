var Item = require('../models/item'),
    fs = require("fs"),
    mapper = require('../lib/model-mapper'),
    sanitize = require('sanitize-filename'),
    logger = require('console-plus'),
    path = require('path');

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
        res.render('item/create', { item : new Item(), itemConditions : Item.ItemConditions });
    });

    app.post('/items/create', function(req, res) {
        var item = new Item(req.body);

        item.save(function(err) {
            if (err) {
                res.render('item/create', {
                    item : item, itemConditions : Item.ItemConditions
                });
            } else {
                res.redirect('/items');
            }
        });
    });

    app.get('/items/:itemId/edit', function(req, res) {
        res.render('item/edit', { itemConditions : Item.ItemConditions });
    });

    app.post('/items/:itemId/edit', function(req, res) {
        mapper.map(req.body).to(res.locals.item);

        res.locals.item.save(function(err) {
            if (err) {
                res.render('item/edit', { itemConditions : Item.ItemConditions });
            } else {
                res.redirect('/items');
            }
        });
    });

    app.post('/items/:itemId/uploadimage',function(req,res) {
        fs.readFile(req.files.displayImage.path, function (err, data) {
            var itemId = req.params.itemId;
            var imageFullPathName = __dirname + "/../public/images/" + itemId;
            fs.writeFile(imageFullPathName, data, function (err) {
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
        try
        {
            // wew To Do: Fix image deletion code
            // check if this item has an uploaded image file
            logger.log("Entering delete");
            var imageFullPathName = path.join(__dirname, "../public/images",
                                              sanitize(req.params.itemId));
            logger.log("imageFullPathName = " + imageFullPathName);

            fs.unlink(imageFullPathName, function(err){
                if (err){
                    // We always seem to get an ENOENT error but the file was successfully deleted.
                    // logger.log("Error in call to fs.unlink", err);
                }
            });

            // remove the item from the database
            Item.remove({ _id : req.params.itemId }, function(err) {
                if (err)
                {
                    console.error(err.message);
                    console.error(err.stack);
                }
                else
                {
                    res.redirect('/items');
                }
            });
        }
        catch (err)
        {
            console.error(err.message);
            console.error(err.stack);
        }
    });
};

// Used to build the index page. Can be safely removed!
module.exports.meta = {
    name : 'Item',
    route : '/items'
};
