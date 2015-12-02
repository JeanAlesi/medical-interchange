var Item = require('../models/item'),
    fs = require("fs"),
    mapper = require('../lib/model-mapper'),
    path = require('path');

///////////////////////////////////////////////////////////////////////////////
// Helper functions
function deleteImage(req){
    var imageFullPathName = path.join(__dirname, "../public/images",
                                      req.params.itemId);

    fs.unlink(imageFullPathName, function(err){
        if (err){
            // We always seem to get an ENOENT error but the file was successfully deleted.
            // console.log("Error in call to fs.unlink", err);
        }
    });
}

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
                //res.redirect('/items');
                res.redirect('/items/' + item._id + '/uploadimage');
            }
        });
    });

    app.get('/items/:itemId/edit', function(req, res) {
        res.render('item/edit', { itemConditions : Item.ItemConditions });
    });

    app.post('/items/:itemId/edit', function(req, res) {
        mapper.map(req.body).to(res.locals.item);
        var itemId = req.params.itemId;

        res.locals.item.save(function(err) {
            if (err) {
                res.render('item/edit', { itemConditions : Item.ItemConditions });
            } else {
                res.redirect('/items/' + itemId + '/uploadimage');
            }
        });
    });

    app.get('/items/:itemId/uploadimage',function(req,res) {
        res.render('item/image_upload');
    });

    app.post('/items/:itemId/uploadimage',function(req,res) {
        fs.readFile(req.files.displayImage.path, function (err, data) {
            var itemId = req.params.itemId;
            var imageFullPathName = __dirname + "/../public/images/" + itemId;
            fs.writeFile(imageFullPathName, data, function (err) {
                res.redirect('back');
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
            deleteImage(req);

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

    app.post('/items/:itemId/deleteimage', function(req, res) {
        deleteImage(req);
        res.redirect('back');
    });
};

// Used to build the index page. Can be safely removed!
module.exports.meta = {
    name : 'Item',
    route : '/items'
};
