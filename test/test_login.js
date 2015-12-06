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

function make_random_string(num_chars)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for( var i=0; i < num_chars; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

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

// ============================================================================

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

// ============================================================================

  // Register POST and verification.
  it('/register POST', function(done){
    var unique_username = make_random_string(10);
    var unique_password =  make_random_string(10);
    chai.request(server)
      .redirects(0)
      .post('/register')
      .field("username", unique_username)
      .field("password", unique_password)
      .end(function (err, res) {
        expect(res).to.redirectTo('/');
        done();
      });
  });

// ============================================================================

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

// ============================================================================

  // Login POST and verification.
  it('/login POST and verification', function(done){
    var unique_username = make_random_string(10);
    var unique_password = make_random_string(10);
    // Create the user.
    chai.request(server)
      .post('/register')
      .redirects(0)
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

// ============================================================================

  // Login POST with invalid credentials.
  it('/login POST with invalid credentials', function(done){
    // Assuming that no other tests registered 11 char users.
    var unique_username = make_random_string(11);
    var unique_password = make_random_string(11);
    chai.request(server)
      .post('/login')
      .field("username", unique_username)
      .field("password", unique_password)
      .end(function (err, res) {
        expect(res).to.have.status(401);
        done();
      });
  });

});
