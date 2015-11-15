//
// Test routes.
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var expect = require('chai').expect;

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

// ============================================================================
// Tests
// ============================================================================

describe('Routes', function() {
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

    // /items/create PUT No Errors
    it('/items/create POST No Errors', function(done){
        var unique_name = 'TESTING_PUT_NO_ERRORS';
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
            done();
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
    var unique_name = 'TEST_ITEM_DESCRIPTION';
    // Create an item to get a response.
    chai.request(server)
      .post('/items/create')
      .field('title',unique_name)
      .field('description','2005 Model Year')
      .field('category','Hospital Equipment')
      .field('condition','Used')
      .end(function(err, res){
      });
    // Get item ID.
    chai.request(server)
      .get('/items')
      .end(function (err, res) {
        desc_item_id = getItemIDFromResponse(res);
    });
    it('Test items description', function(done){
        chai.request(server)
          .get('/items/'.concat(desc_item_id,'/detail'))
          .end(function (err, res) {
            res.should.have.status(200);
            done();
          });
    });

// ============================================================================

    // Item delete GET
    it('Test items deletion GET', function(done){
      var unique_name = 'TEST_ITEM_DELETION';
      // Create an item to get a response.
      chai.request(server)
        .post('/items/create')
        .field('title',unique_name)
        .field('description','2005 Model Year')
        .field('category','Hospital Equipment')
        .field('condition','Used')
        .end(function(err, res){
        });
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
      var unique_name = 'TEST_ITEM_DELETION';
      // Create an item to get a response.
      chai.request(server)
        .post('/items/create')
        .field('title',unique_name)
        .field('description','2005 Model Year')
        .field('category','Hospital Equipment')
        .field('condition','Used')
        .end(function(err, res){
        });
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
      // Create an item to get a response.
      chai.request(server)
        .post('/items/create')
        .field('title',unique_name)
        .field('description','2005 Model Year')
        .field('category','Hospital Equipment')
        .field('condition','Used')
        .end(function(err, res){
        });
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

    // Item edit POST
    it('Test items edit POST', function(done){
      var unique_name_before = 'TEST_ITEM_BEFORE';
      var unique_name_after = 'TEST_ITEM_AFTER';
      // Create an item to get a response.
      chai.request(server)
        .post('/items/create')
        .field('title',unique_name_before)
        .field('description','2005 Model Year')
        .field('category','Hospital Equipment')
        .field('condition','Used')
        .end(function(err, res){
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
            done();
          });
        });
      });

// ============================================================================

    // TODO: Item upload image
});
