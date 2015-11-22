var Item = require('../models/item'),
    fs = require("fs"),
    mapper = require('../lib/model-mapper'),
    logger = require('console-plus');

module.exports = function(app) {

    // ============================================================================
    // app.param
    // The app.param method maps the itemId parameter prior to executing the route.
    app.param('itemId', function(req, res, next, id) {
        logger.log("just inside function");
        Item.findById(id, function(err, item) {
            logger.log("Item.findById");
            if (err) {
                logger.log("if (err)");
                next(err);
            } else {
                logger.log("else 1");
                logger.log(item);
                res.locals.item = item;
                logger.log("else 2");
                next();
                logger.log("else 3");
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
        logger.log("req.files.displayImage.path = " + req.files.displayImage.path);
        fs.readFile(req.files.displayImage.path, function (err, data) {
            var itemId = req.params.itemId;
            var imageFullPathName = __dirname + "/../public/images/" + req.params.itemId;
            fs.writeFile(imageFullPathName, data, function (err) {
                res.redirect("back");
            });
        });
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
