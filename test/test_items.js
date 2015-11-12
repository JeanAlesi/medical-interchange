//
// Test items.
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Items', function() {
  it('should list ALL items GET ALL', function(done){
    chai.request(server)
    .get('/items')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
  it('should list a SINGLE blob GET');
  it('should add a SINGLE blob POST');
  it('should update a SINGLE blob  PUT');
  it('should delete a SINGLE blob  DELETE');
});
