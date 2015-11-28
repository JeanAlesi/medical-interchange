//
// Test routes.
//

// Note: The SuperAgent operators like .post, .end, etc just don't
// seem to work right outside of a Mocha "it" test.  If we can find a
// fix for this problem then a lot of test helpers could be factored
// out (like getting an ID from a single database item).

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
    sleep(10000);
}

// ============================================================================
// Tests
// ============================================================================

describe('Routes', function(done) {
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

    // ============================================================================

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

    // ============================================================================

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
        sleep(10000);
        done();
    });

    // ============================================================================

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

    // ============================================================================

    // Item description test
    it('Test items description', function(done){
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
        sleep(10000);

        // Get item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                desc_item_id = getItemIDFromResponse(res);
                chai.request(server)
                    .get('/items/'.concat(desc_item_id,'/detail'))
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
            });
    });


    // ============================================================================

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
        sleep(10000);

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

    // ============================================================================

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
        sleep(10000);

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

    // ============================================================================

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
    sleep(10000);

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

    // ============================================================================

    // Items edit POST No Errors
    it('Test items edit POST No Errors', function(done){
        var unique_name_after = 'TEST_ITEM_AFTER';

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

        // Get the item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                edit_item_id = getItemIDFromResponse(res);
                // Make changes to the name.
                chai.request(server)
                    .post('/items/'.concat(edit_item_id, "/edit"))
                    .field('title', unique_name_after)
                    .field('description','2005 Model Year')
                    .field('category','Hospital Equipment')
                    .field('condition','Used')
                    .end(function(err, res) {
                    });

                // Verify changes.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        res.should.have.status(200);

                        // to do: Fix this section of code
                        var name_after_name_index = res.text.indexOf(unique_name_after);
                        //expect(name_after_name_index).to.not.equal(-1);
                        //logger.log(res);
                        done();
                    });
            });
    });

    // ============================================================================
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
                        assert(false);
                    });

                // wait 10 seconds for the image to upload and the transaction to post
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
});
