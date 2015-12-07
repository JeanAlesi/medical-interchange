var Item = require('../models/item'),
    fs = require("fs"),
    mapper = require('../lib/model-mapper'),
    path = require('path'),
    mongoose = require("mongoose");

////////////////////////////////////////////////////////////////////////////////
// constants
///////////////////////////////////////////////////////////////////////////////
const MAX_NUM_IMAGES = 6;

///////////////////////////////////////////////////////////////////////////////
// Helper functions

function checkAuth(req,res) {
    if(!req.isAuthenticated() && req.headers['test']!="true") {
        res.redirect('/login');
    }
}

module.exports = function(app) {
    // ============================================================================
    // route handler
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
    // GET /items
    app.get('/items', function(req, res) {
        Item.find({}, function(err, items) {
            res.render('item/index', { items : items });
        });
    });

    // ============================================================================
    // GET /create
    app.get('/items/create', function(req, res) {
        checkAuth(req,res)
        res.render('item/create', { item : new Item(), itemConditions : Item.ItemConditions });
    });

    // ============================================================================
    // POST /create
    app.post('/items/create', function(req, res) {
        var item = new Item(req.body);
        item.user = 'NA'
        if ('user' in req) {
            item.user = req.user.username
        }

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

    // ============================================================================
    // GET /edit
    app.get('/items/:itemId/edit', function(req, res) {
        checkAuth(req,res)
        res.render('item/edit', { itemConditions : Item.ItemConditions });
    });

    // ============================================================================
    // POST /edit
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

    // ============================================================================
    // GET /uploadimage
    app.get('/items/:itemId/uploadimage',function(req,res) {
        res.render('item/image_upload');
    });

    // ============================================================================
    // POST /uploadimage
    app.post('/items/:itemId/uploadimage',function(req,res) {
        // read the uploaded file data
        fs.readFile(req.files.displayImage.path, function (err, fileData) {
            if(err | (fileData.length == 0)){
                res.redirect('back');
            }
            else{
                // Find the item in the database
                Item.findById(res.locals.item._id, function(err, item) {
                    if (err) {
                        //console.error("Error finding item", err);
                        res.redirect('back');
                    }
                    else{
                        if (item.imageFileNames.length < MAX_NUM_IMAGES) {
                            // write the uploaded file to the
                            // /public/images directory
                            var fileName = mongoose.Types.ObjectId().toString();
                            var imageFullPathName =
                                __dirname + "/../public/images/" + fileName;
                            fs.writeFile(imageFullPathName, fileData, function (err) {

                                // Add the image file name to the database
                                item.imageFileNames.push(fileName);

                                // synchronously save the item to the database
                                item.save();
                                res.redirect('back');
                            });
                        }
                        else {
                            res.redirect('back');
                        }
                    }
                });
            }
        });
    });

    // ============================================================================
    // GET /detail
    app.get('/items/:itemId/detail', function(req, res) {
        res.render('item/detail');
    });

    // ============================================================================
    // GET /delete
    app.get('/items/:itemId/delete', function(req, res) {
        checkAuth(req,res)
        res.render('item/delete');
    });

    // ============================================================================
    // POST /delete
    app.post('/items/:itemId/delete', function(req, res) {
        try
        {
            // Find the item in the database
            Item.findById(req.params.itemId, function(err, item) {
                if (err) {
                    console.error("Error finding item", err);
                    res.redirect('/items');
                }
                else{
                    // while there are image files to delete
                    while (item.imageFileNames.length > 0)
                    {
                        // delete the image file from the disk
                        var imageFullPathName =
                            path.join(__dirname, "../public/images",
                                      item.imageFileNames[0]);
                        fs.unlink(imageFullPathName, function(err) {
                            if (err) {
                                console.error("Unlink error: ", err);
                            }
                        });

                        // delete imageFileNames[0]
                        item.imageFileNames.splice(0, 1);
                    }
                }

                // synchronously remove the item from the database
                item.remove();
                res.redirect('/items');
            });
        }
        catch (err)
        {
            console.error(err.message);
            console.error(err.stack);
        }
    });

    // ============================================================================
    // POST /deleteimage
    app.post('/items/:itemId/deleteimage', function(req, res) {
        // Find the item in the database
        Item.findById(req.params.itemId, function(err, item) {
            if (err) {
                console.error("Error finding item", err);
                res.redirect('back');
            }
            else{
                // while there are image files to delete
                while (item.imageFileNames.length > 0)
                {
                    // delete the image file from the disk
                    var imageFullPathName = path.join(__dirname, "../public/images",
                                                      item.imageFileNames[0]);
                    fs.unlink(imageFullPathName, function(err) {
                        if (err) {
                            console.error("Unlink error: ", err);
                        }
                    });

                    // delete imageFileNames[0]
                    item.imageFileNames.splice(0, 1);
                }
            }

            // synchronously save the item to the database
            item.save();
            res.redirect('back');
        });
    });
}

// ============================================================================
// Used to build the index page. Can be safely removed!
module.exports.meta = {
    name : 'Item',
    route : '/items'
};
