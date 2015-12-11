var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

describe('Search', function() {
    // ============================================================================
    // Test item search GET
    it('Test item search GET', function(done){
        chai.request(server)
            .get('/search')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});
