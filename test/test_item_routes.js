//
// Test routes.
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var expect = require('chai').expect;
var assert = require('chai').assert;
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
chai.use(chaiHttp);

// ============================================================================
// Helper functions
// ============================================================================

function getItemIDFromResponse(res) {
    // Split the string into tokens.
    var separators = ['"', '/'];
    var tokens = res.text.split(new RegExp(separators.join('|'), 'g'));
    // Item ID will be the token before any 'detail'.
    return tokens[tokens.indexOf('detail')-1];
}

// utility function which deletes all items in the database.
function deleteAllDatabaseItems()
{
    // for each item in the database
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
}

function sleep(time) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
}

// ============================================================================
// Tests
// ============================================================================

describe('Routes', function(done) {
    // ============================================================================

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
            .set('test', 'true')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    // ============================================================================

    // /items/create PUT No Errors
    it('/items/create POST No Errors', function(done){
        var unique_name = 'TESTING_PUT_NO_ERRORS';
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        var index = res.text.indexOf(unique_name);
                        expect(index).to.not.equal(-1);
                        done();
                    });
            });
    });

    // ============================================================================

    // /items/create PUT Missing Fields
    it('/items/create POST Missing Fields', function(done){
        var unique_name = 'TESTING_PUT_MISSING_FIELD';
        var missing_title_err = "Title is required"
        var missing_description_err = "Description is required";
        var missing_category_err = "Category is required";
        chai.request(server)
            .post('/items/create')
            .redirects(0)
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

    it('Test items description', function(done){
        // Item description test
        var unique_name = 'TEST_ITEM_DESCRIPTION';
        // Create an item to get a response.
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        desc_item_id = getItemIDFromResponse(res);
                        chai.request(server)
                            .get('/items/'.concat(desc_item_id,'/detail'))
                            .end(function (err, res) {
                                res.should.have.status(200);
                                var unique_name_index = res.text.indexOf(unique_name);
                                expect(unique_name_index).to.not.equal(-1);
                                done();
                            });
                    });
            });
    });

    // ============================================================================

    // Item delete GET
    it('Test items deletion GET', function(done){
        var unique_name = 'TEST_ITEM_DELETION';
        // Create an item to get a response.
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get the item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        deletion_item_id = getItemIDFromResponse(res);
                        // request the /items/delete page
                        chai.request(server)
                            .get('/items/'.concat(deletion_item_id,'/delete'))
                            .set('test', 'true')
                            .end(function (err, res) {
                                res.should.have.status(200);
                                done();
                            });
                    });
            });
    });

    // ============================================================================

    // Item delete POST
    it('Test items deletion POST', function(done){
        var unique_name = 'TEST_ITEM_DELETION';
        // Create an item to get a response.
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get the item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        deletion_item_id = getItemIDFromResponse(res);
                        // Delete the item via POST.
                        chai.request(server)
                            .post('/items/'.concat(deletion_item_id,'/delete'))
                            .redirects(0)
                            .end(function (err, res) {
                                res.should.have.status(302);
                                // Verify we can't view the item again.
                                chai.request(server)
                                    .get('/items/'.concat(deletion_item_id,'detail'))
                                    .end(function (err, res) {
                                        res.should.have.status(404);
                                        done();
                                    });
                            });
                    });
            });
    });

    // ============================================================================

    // Item edit GET
    it('Test items edit GET', function(done){
        var unique_name = 'TEST_ITEM_GET';
        // Create an item to get a response.
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get the item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        edit_item_id = getItemIDFromResponse(res);
                        // Visit the "are you sure?" page.
                        chai.request(server)
                            .get('/items/'.concat(edit_item_id,'/edit'))
                            .set('test', 'true')
                            .end(function (err, res) {
                                res.should.have.status(200);
                                done();
                            });
                    });
            });
    });

    // ============================================================================

    // Item edit POST
    it('Test items edit POST', function(done){
        var unique_name_before = 'TEST_ITEM_BEFORE';
        var unique_name_after = 'TEST_ITEM_AFTER';
        // Create an item to get a response.
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name_before)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get the item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        edit_item_id = getItemIDFromResponse(res);
                        // Make changes to the name.
                        chai.request(server)
                            .post('/items/'.concat(edit_item_id, "/edit"))
                            .redirects(0)
                            .field('title', unique_name_after)
                            .field('description','2005 Model Year')
                            .field('category','Hospital Equipment')
                            .field('condition','Used - Good')
                            .field('user','bob')
                            .end(function(err, res) {
                                // Verify changes.
                                chai.request(server)
                                    .get('/items')
                                    .end(function (err, res) {
                                        res.should.have.status(200);
                                        var unique_name_index = res.text.indexOf(unique_name_after);
                                        expect(unique_name_index).to.not.equal(-1);
                                        done();
                                    });
                            });
                    });
            });
    });

    // ============================================================================
    // Test item upload image GET
    it('Test item upload image GET', function(done){
        // Create an item to get a response.
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title','Wills Awesome Item')
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get the item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        item_id = getItemIDFromResponse(res);
                        var upload_image_get_route = '/items/'.concat(item_id, '/uploadimage');
                        chai.request(server)
                            .get(upload_image_get_route)
                            .end(function (err, res) {
                                res.should.have.status(200);
                                done();
                            });
                    })
            });
    });

    // ============================================================================

    // Test Delete an item which includes an uploaded image
    it('Test Delete an item which includes an uploaded image', function(done){
        // create the item
        var unique_name = 'DELETE_ITEM_WITH_IMAGE';
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get the item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        item_id = getItemIDFromResponse(res);
                        // upload the image
                        var image_name = __dirname + '/../public/images/P1000788.jpg';
                        chai.request(server)
                            .post('/items/'.concat(item_id,'/uploadimage'))
                            .redirects(0)
                            .attach('displayImage', image_name)
                            .end(function(err, res) {
                                // now delete the item
                                chai.request(server)
                                    .post('/items/'.concat(item_id,'/delete'))
                                    .redirects(0)
                                    .end(function (err, res) {
                                        res.should.have.status(302);
                                        // verify that the image file was actually deleted
                                        var imageFullPathName = __dirname + "/../public/images/" + item_id;
                                        var normalizedPathName = path.normalize(imageFullPathName);
                                        fs.exists(normalizedPathName, function(exists){
                                            if (exists){
                                                assert(false);
                                            }
                                        });

                                        // to do: Check the /detail route to verify that the image was deleted
                                        done();
                                    });
                            });
                    });
            });
    });

    // ============================================================================

    // Test deleteimage route
    it('Test deleteimage route', function(done){
        // create the item
        var unique_name = 'ITEM_DELETE_IMAGE_ROUTE';
        var imageDirName = '/images/';
        const idLength = 24;
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // Get the item ID.
                chai.request(server)
                    .get('/items')
                    .end(function (err, res) {
                        item_id = getItemIDFromResponse(res);
                        // upload the image
                        var image_name = __dirname + '/../public/images/P1000788.jpg';
                        chai.request(server)
                            .post('/items/'.concat(item_id,'/uploadimage'))
                            .redirects(0)
                            .attach('displayImage', image_name)
                            .end(function(err, res) {
                                // Verify that the uploaded image is included in the response
                                chai.request(server)
                                    .get('/items')
                                    .end(function (err, res) {
                                        // the image name is in the text segment and its named /images/item_id
                                        //console.log("res = ", res);
                                        var image_name_index = res.text.indexOf(imageDirName);
                                        var image_name_index = image_name_index + imageDirName.length;
                                        var imageName = res.text.substring(image_name_index, image_name_index + idLength);
                                        //console.log("imageName = ", imageName);
                                        // verify that the image file exists
                                        var imageFullPathName = __dirname + "/../public/images/" + imageName;
                                        var normalizedPathName = path.normalize(imageFullPathName);
                                        fs.exists(normalizedPathName, function(exists){
                                            if (!exists){
                                                assert(false);
                                            }
                                        });

                                        // Now delete the item to exercise the route code which deletes
                                        // the image associated with an item.
                                        chai.request(server)
                                            .post('/items/'.concat(item_id,'/deleteimage'))
                                            .redirects(0)
                                            .end(function (err, res) {
                                                res.should.have.status(302);
                                                // Verify we can't view the item again.
                                                chai.request(server)
                                                    .get('/items/'.concat(item_id,'/detail'))
                                                    .end(function (err, res) {
                                                        res.should.have.status(200);
                                                        // verify that the image file was actually deleted
                                                        fs.exists(normalizedPathName, function(exists){
                                                            if (exists){
                                                                assert(false);
                                                            }
                                                        });
                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });

 // ============================================================================
    // Test that the form doesn't accept an invalid condition
    it('Does not accept an invalid condition', function(done){
        // Create an item to get a response.
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title','Davids Awesome Item')
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Invalid')
            .field('user','bob')
            .end(function(err, res){
                expect(res.statusCode).to.equal(200); //200 means it failed as expected (it reloads the page)
                done();
            });
    });

    // ============================================================================

    // Test item search POST
    it('Test item search POST', function(done){
        // create the item
        var unique_name = 'ITEM_SEARCH';
        chai.request(server)
            .post('/items/create')
            .redirects(0)
            .field('title',unique_name)
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used - Good')
            .field('user','bob')
            .end(function(err, res){
                // search for the item
                chai.request(server)
                    .post('/items/search')
                    .redirects(0)
                    .field('title',unique_name)
                    .end(function(err, res) {
                        // verify that the search was successful
                        //console.log(res);
                        res.should.have.status(200);
                        var image_name_index = res.text.indexOf(unique_name);
                        expect(image_name_index).to.not.equal(-1);
                        done();
                    });
            });
    });
});
