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
        });
    chai.request(server)
        .get('/items')
        .end(function (err, res) {
            res.should.have.status(200);
            var index = res.text.indexOf(unique_name);
            expect(index).to.not.equal(-1);
        });
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
        CreateItem();
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
        CreateItem();

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
        CreateItem();

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
        CreateItem();

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
        var unique_name = 'TEST_ITEM_GET';
        CreateItem();

        // Get the item ID.
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                edit_item_id = getItemIDFromResponse(res);
                // Visit the "are you sure?" page.
                chai.request(server)
                    .get('/items/'.concat(edit_item_id,'/edit'))
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
            });
    });

    // ============================================================================

    // Item edit POST No Errors
    it('Test items edit POST No Errors', function(done){
        var unique_name_before = 'TEST_ITEM_BEFORE';
        var unique_name_after = 'TEST_ITEM_AFTER';
        // Create an item to get a response.
        CreateItem();

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
                        //console.log(res);
                        done();
                    });
            });
    });

    function DeleteItemWithImage() {
        // verify that the test item has an image
        chai.request(server)
            .get('/items')
            .end(function (err, res) {
                //console.log(res.text);
                var item_id = getItemIDFromResponse(res);
                var imageName = '/images/' + item_id;
                var imageIndex = res.text.indexOf(imageName);
                expect(imageIndex).to.not.equal(-1);

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
                                    });
                            });
                    });
            });
    }

    // ============================================================================
    // Test item upload image POST With No Errors
    it('Test item upload image POST With No Errors', function(done){
        // Create an item
        CreateItem();

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
                    .attach('diaplayImage', image_name)
                    .end(function(err, res) {
                        // note that we should never get here because the post responds with a redirect
                        assert(false);
                    });

                DeleteItemWithImage();
                done();
            });
    });
});
