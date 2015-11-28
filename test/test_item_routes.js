//
// Test routes.
//

// Note: The SuperAgent operators like .post, .end, etc just don't
// seem to work right outside of a Mocha "it" test.  If we can find a
// fix for this problem then a lot of test helpers could be factored
// out (like getting an ID from a single database item).

var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var expect = require('chai').expect;
var assert = require('chai').assert;
var logger = require('console-plus');
chai.use(chaiHttp);

// ============================================================================
// Helper functions
// ============================================================================
///////////////////////////////////////////////////////////////////////////////
// utility function which deletes all items in the database.
function deleteAllDatabaseItems()
{
    // for each item in the database
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
}

// ============================================================================
// Utility function to get an item ID from a response containing a single
// databse item.
function getItemIDFromResponse(res) {
    // Split the string into tokens.
    var separators = ['"', '/'];
    var tokens = res.text.split(new RegExp(separators.join('|'), 'g'));
    // Item ID will be the token before any 'detail'.
    return tokens[tokens.indexOf('detail')-1];
}

// ============================================================================
// Utility function to keep the thread busy for a specified period of milli-sec
// Use this function to wait for the server to finish actions when the
// SuperTest framework doesn't get a response from the server.
function sleep(timeMilliSec) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + timeMilliSec) {
        ;
    }
}

// ============================================================================
// Utility function to create an item in the database
function CreateItem(){
    var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';
    chai.request(server)
        .post('/items/create')
        .field('title',unique_name)
        .field('description','2005 Model Year')
        .field('category','Hospital Equipment')
        .field('condition','Used')
        .end(function(err, res){
            // never get here because the server doesn't send a response
        });
    // wait for the server to finish creating the item
    sleep(1000);
}

// ============================================================================
// Tests
// ============================================================================

// ============================================================================
describe('DESCRIBE /items GET', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // /items GET
    it('/items GET', function(done){
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE /items/create GET', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // /items/create GET
    it('/items/create GET', function(done){
        chai.request(server)
            .get('/items/create')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE /items/create POST No Errors', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // /items/create POST No Errors
    it('/items/create POST No Errors', function(done){
        var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';
        chai.request(server)
            .post('/items/create')
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used')
            .end(function(err, res){
                // never get here because the server doesn't send a response
            });
        // wait for the server to finish creating the item
        sleep(1000);
        done();
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE /items/create POST Missing Fields', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // /items/create POST Missing Fields
    it('/items/create POST Missing Fields', function(done){
        var unique_name = 'TESTING_PUT_MISSING_FIELD';
        var missing_title_err = "Title is required"
        var missing_description_err = "Description is required";
        var missing_category_err = "Category is required";
        chai.request(server)
            .post('/items/create')
        // Missing title.
        // Missing description.
        // Missing category.
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                var title_index = res.text.indexOf(missing_title_err);
                expect(title_index).to.not.equal(-1);
                var description_index = res.text.indexOf(missing_description_err);
                expect(description_index).to.not.equal(-1);
                var category_index = res.text.indexOf(missing_category_err);
                expect(category_index).to.not.equal(-1);
                done();
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE Item description test', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // Item description test
    it('Create an item', function(done){
        logger.log("Starting Test items description test");
        var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';
        chai.request(server)
            .post('/items/create')
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used')
            .end(function(err, res){
                // should never get here because the server doesn't send a response
                // in practice - the following code never executes
                logger.log("Inside end block");
                done();
            });
        // wait for the server to finish creating the item
        sleep(1000);
        done();
    });

    it('Verify the new item was created', function(done){
        // Get item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                logger.log("Inside end block");
                desc_item_id = getItemIDFromResponse(res);
                chai.request(server)
                    .get('/items/'.concat(desc_item_id,'/detail'))
                    .end(function (err, res) {
                        logger.log("Inside end block");
                        res.should.have.status(200);
                        logger.log("Ending Test items description test");
                        done();
                    });
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE Item delete GET', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // Item delete GET
    it('Test items deletion GET', function(done){
        // create the item
        var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';
        chai.request(server)
            .post('/items/create')
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used')
            .end(function(err, res){
                // never get here because the server doesn't send a response
            });
        // wait for the server to finish creating the item
        sleep(1000);

        // Get the item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                deletion_item_id = getItemIDFromResponse(res);
                // Visit the "are you sure?" page.
                chai.request(server)
                    .get('/items/'.concat(deletion_item_id,'/delete'))
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE Item delete Post', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // Item delete POST
    it('Test items deletion POST', function(done){
        // create the item
        var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';
        chai.request(server)
            .post('/items/create')
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used')
            .end(function(err, res){
                // never get here because the server doesn't send a response
            });

        // wait for the server to finish creating the item
        sleep(1000);

        // Get the item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                deletion_item_id = getItemIDFromResponse(res);
                // Delete the item via POST.
                chai.request(server)
                    .post('/items/'.concat(deletion_item_id,'/delete'))
                    .end(function (err, res) {
                        res.should.have.status(200);
                        // Verify we can't view the item again.
                        chai.request(server)
                            .get('/items/'.concat(deletion_item_id,'details'))
                            .end(function (err, res) {
                                res.should.have.status(404);
                                done();
                            });
                    });
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE Item edit Get', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // Item edit GET
    it('Test items edit GET', function(done){
            var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';
    chai.request(server)
        .post('/items/create')
        .field('title',unique_name)
        .field('description','2005 Model Year')
        .field('category','Hospital Equipment')
        .field('condition','Used')
        .end(function(err, res){
            // never get here because the server doesn't send a response
        });
    // wait for the server to finish creating the item
    sleep(1000);

        // Get the item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                edit_item_id = getItemIDFromResponse(res);
                chai.request(server)
                    .get('/items/'.concat(edit_item_id,'/edit'))
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE Item upload image Post', function(done) {
    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // Test item upload image POST With No Errors
    it('Test item upload image POST With No Errors', function(done){
        // create the item
        var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';
        chai.request(server)
            .post('/items/create')
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used')
            .end(function(err, res){
                // never get here because the server doesn't send a response
            });
        sleep(1000);

        var item_id = '';
        var redirects = [];

        // Get the item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                item_id = getItemIDFromResponse(res);

                // upload the image
                var image_name = __dirname + '/../public/images/P1000788.jpg';
                chai.request(server)
                    .post('/items/'.concat(item_id,'/uploadimage'))
                    .attach('displayImage', image_name)
                    .end(function(err, res) {
                        // note that we should never get here because the post responds with a redirect
                        // assert(false);
                    });

                // wait for the image to upload and the transaction to post
                sleep(1000);

                // to do: verify that the test item has the uploaded image

                // delete the item
                logger.log("getting item id to delete the item with image");
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        var item_id = getItemIDFromResponse(res);
                        logger.log("posting a delete on item " + item_id);
                        chai.request(server)
                            .post('/items/'.concat(item_id,'/delete'))
                            .end(function (err, res) {
                                logger.log("done posting the delete");
                                res.should.have.status(200);
                                // Verify we can't view the item again.
                                logger.log("Checking if we can view the deleted item ...");
                                chai.request(server)
                                    .get('/items/'.concat(item_id,'/details'))
                                    .end(function (err, res) {
                                        res.should.have.status(404);
                                        logger.log("Successfully deleted the item with image!");
                                        done();
                                    });
                            });
                    });
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();
        logger.log("Ending the after hook");
        return done();
    });
});

// ============================================================================
describe('DESCRIBE Edit Item No Errors', function(done) {
    // Note: This test had to be broken up int separate "it" tests
    // because HTTP caching was preventing the final get from
    // accessing the edited / updated item data (cached data was used
    // instead).  Breaking the server operations up into separate test
    // cases worked around the cache problem.

    var edit_item_id;
    var unique_name_after = 'TEST_ITEM_AFTER';

    before(function (done) {
        logger.log("Starting the before hook");
        deleteAllDatabaseItems();
        logger.log("Ending the before hook");
        return done();
    });

    // Items edit POST No Errors
    it('Create the item', function(done){
        var unique_name = 'ITEM_CREATE_POST_NO_ERRORS';

        // create the item
        chai.request(server)
            .post('/items/create')
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used')
            .end(function(err, res){
                //logger.log("Inside .post");
                // never get here because the server doesn't send a response
            });
        //logger.log("after .post");
        sleep(1000);
        done();
    });

    it('Get the new item ID and edit the item', function(done){
        // Get the item ID.
        chai.request(server)
            .get('/items')
        //.use(noCache)
            .end(function (err, res) {
                //logger.log("inside first .get");
                edit_item_id = getItemIDFromResponse(res);
                // Make changes to the name.
                chai.request(server)
                    .post('/items/'.concat(edit_item_id, "/edit"))
                    .field('title', unique_name_after)
                    .field('description','2005 Model Year')
                    .field('category','Hospital Equipment')
                    .field('condition','Used')
                    .end(function(err, res) {
                        //logger.log("Inside the end block of Test items edit POST No Errors.");
                    });
                sleep(1000);
                done();
            });
    });

    it('Verify the edited item', function(done){
        // Verify changes.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                //logger.log("inside second .get");
                res.should.have.status(200);

                // to do: Fix this section of code
                //expect(res.to.contain(unique_name_after));
                //logger.log(res);
                var unique_name_index = res.text.indexOf(unique_name_after);
                expect(unique_name_index).to.not.equal(-1);
                done();
            });
    });

    after(function (done) {
        logger.log("Starting the after hook");
        deleteAllDatabaseItems();

        // VERY IMPORTANT: Only call disconnect() after the very last test is complete!
        mongoose.disconnect();
        logger.log("Ending the after hook");
        return done();
    });
});
