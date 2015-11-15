//
// Test routes.
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var expect = require('chai').expect;

chai.use(chaiHttp);

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

    it.skip('should update a SINGLE blob  PUT');
    it.skip('should delete a SINGLE blob  DELETE');
});
