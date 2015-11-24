var Item = require('../models/item'),
    fs = require("fs"),
    mapper = require('../lib/model-mapper'),
    logger = require('console-plus');

module.exports = function(app) {

    // ============================================================================
    // app.param
    // The app.param method maps the itemId parameter prior to executing the route.
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

    // ============================================================================
    // /items GET
    app.get('/items', function(req, res) {
        Item.find({}, function(err, items) {
            res.render('item/index', { items : items });
        });
    });

    // ============================================================================
    // /items/create GET
    app.get('/items/create', function(req, res) {
        res.render('item/create', { item : new Item(), itemConditions : Item.ItemConditions });
    });

    // ============================================================================
    // /items/create POST
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

    // ============================================================================
    // /items/:itemId/edit GET
    app.get('/items/:itemId/edit', function(req, res) {
        res.render('item/edit', { itemConditions : Item.ItemConditions });
    });

    // ============================================================================
    // /items/:itemId/edit POST
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

    // ============================================================================
    // /items/:itemId/uploadimage POST
    app.post('/items/:itemId/uploadimage',function(req,res) {
        logger.log("typeof(req.files.displayImage.path) = ");
        if (typeof req.files === 'undefined'){
            logger.error("req.files is undefined!!");
        }
        else {
            fs.readFile(req.files.displayImage.path, function (err, data) {
                var itemId = req.params.itemId;
                var imageFullPathName = __dirname + "/../public/images/" + req.params.itemId;
                fs.writeFile(imageFullPathName, data, function (err) {
                    res.redirect("back");
                });
            });
        }
    });

    // ============================================================================
    // /items/:itemId/detail GET
    app.get('/items/:itemId/detail', function(req, res) {
        res.render('item/detail');
    });

    // ============================================================================
    // /items/:itemId/delete GET
    app.get('/items/:itemId/delete', function(req, res) {
        res.render('item/delete');
    });

    // ============================================================================
    // /items/:itemId/delete POST
    app.post('/items/:itemId/delete', function(req, res) {
        try
        {
            // check if this item has an uploaded image file
            var imageFullPathName = __dirname + "/../public/images/" + req.params.itemId;

            // get the stats for the image file
            fs.lstat(imageFullPathName, function(err, stats)
                     {
                         if (err)
                         {
                             console.error(err.message);
                             console.error(err.stack);
                         }
                         else
                         {
                             // if an image exists
                             if (stats.isFile())
                             {
                                 // delete the image
                                 fs.unlink(imageFullPathName, function(err)
                                           {
                                               if (err)
                                               {
                                                   console.error(err.message);
                                                   console.error(err.stack);
                                               }
                                           });
                             }
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
