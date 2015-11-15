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
                console.log(res);
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    // wew to do: Check with Tony why this test fails when using done().
    // /items/create PUT No Errors
    it('/items/create POST No Errors', function(done){
        chai.request(server)
            .post('/items/create')
            .field('title','XRay Machine')
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .field('condition','Used')
            //.send('submit', 'Create')
            .end(function(err, res){
                console.log("Processing response in /items/create PUT With No Errors");
                console.log(res);
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                // wew to do: Check with Tony and Greg on why the
                // redirect check doesn't work.
                // expect(res).to.redirect;
                done();
            });
    });

    // /items/create PUT With Errors
    it.skip('/items/create POST With Errors', function(done){
        chai.request(server)
        // post with missing condition fields
            .post('/items/create/')
            .field('title','XRay Machine')
            .field('description','2005 Model Year')
            .field('category','Hospital Equipment')
            .end(function(err, res) {
                //console.log("Processing response in /items/create PUT With Errors");
                //console.log(res);
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                //var error_index = res.text.indexOf("Condition is required");
                //var success = false;
                //if (error_index > -1)
                //{
                //    success = true;
                //}
                //expect(success).to.equal(true);
                //expect(res.text).to.contain('Condition is required');
                done();
            });
    });

    it.skip('should update a SINGLE blob  PUT');
    it.skip('should delete a SINGLE blob  DELETE');
});
