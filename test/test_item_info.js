var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

describe('Item info', function() {
    // ============================================================================
    // test location.js GET
    it('Test location info page GET', function(done){
        chai.request(server)
            .get('/locations')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    // test conditions.js GET
    it('Test location info page GET', function(done){
        chai.request(server)
            .get('/conditions')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});