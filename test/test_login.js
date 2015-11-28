//
// Test login.
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

// ============================================================================
// Tests
// ============================================================================

describe('Login tests', function() {

  // Base.
  it('/ GET', function(done){
    chai.request(server)
      .get('/items')
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
      });
  });

  // Register GET.
  it('/register GET', function(done){
    chai.request(server)
      .get('/register')
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
      });
  });

  // Register POST and verification.
  it('/register POST', function(done){
    var unique_username = 'registerpostuser';
    var unique_password = 'p4ssw0rd';
    chai.request(server)
      .post('/register')
      .field("username", unique_username)
      .field("password", unique_password)
      .end(function (err, res) {
        done();
      });
  });

  // Login GET.
  it('/login GET', function(done){
    chai.request(server)
      .get('/login')
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
      });
  });

  // Login POST and verification.
  it('/login POST and verification', function(done){
    var unique_username = 'loginpostuser';
    var unique_password = 'p4ssw0rd';
    // Create the user.
    chai.request(server)
      .post('/register')
      .field("username", unique_username)
      .field("password", unique_password)
      .end(function (err, res) {
        // Verify the user is there and can login.
        chai.request(server)
          .post('/login')
          .field("username", unique_username)
          .field("password", unique_password)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
  });

});
