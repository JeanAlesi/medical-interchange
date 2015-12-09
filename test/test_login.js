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

  // Register POST and verification for admins.
  it('/register POST - admin', function(done){
    var unique_username = make_random_string(10);
    var unique_password =  make_random_string(10);
    chai.request(server)
      .post('/register')
      .redirects(0)
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Admin")
      .end(function (err, res) {
        expect(res).to.redirectTo('/');
        done();
      });
  });

// ============================================================================

  // Register POST and verification for donors.
  it('/register POST - donor', function(done){
    var unique_username = make_random_string(10);
    var unique_password =  make_random_string(10);
    chai.request(server)
      .post('/register')
      .redirects(0)
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Donor")
      .end(function (err, res) {
        expect(res).to.redirectTo('/');
        done();
      });
  });

// ============================================================================

  // Register POST and verification for recipient.
  it('/register POST - recipient', function(done){
    var unique_username = make_random_string(10);
    var unique_password =  make_random_string(10);
    chai.request(server)
      .post('/register')
      .redirects(0)
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Recipient")
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

  // Login POST and verification - donor.
  it('/login POST and verification - donor', function(done){
    this.timeout(3000);
    var unique_username = make_random_string(10);
    var unique_password = make_random_string(10);
    // Create the user.
    chai.request(server)
      .post('/register')
      .redirects(0)
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Donor")
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

  // Login POST and verification - recipient.
  it('/login POST and verification - recipient', function(done){
    this.timeout(3000);
    var unique_username = make_random_string(10);
    var unique_password = make_random_string(10);
    // Create the user.
    chai.request(server)
      .post('/register')
      .redirects(0)
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Recipient")
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

  // Login POST and verification - admin.
  it('/login POST and verification - admin', function(done){
    this.timeout(3000);
    var unique_username = make_random_string(10);
    var unique_password = make_random_string(10);
    // Create the user.
    chai.request(server)
      .post('/register')
      .redirects(0)
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Admin")
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

  // Login POST with invalid credentials - admin.
  it('/login POST with invalid credentials - admin', function(done){
    // Assuming that no other tests registered 11 char users.
    var unique_username = make_random_string(11);
    var unique_password = make_random_string(11);
    chai.request(server)
      .post('/login')
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Admin")
      .end(function (err, res) {
        expect(res).to.have.status(401);
        done();
      });
  });

// ============================================================================

  // Login POST with invalid credentials - donor.
  it('/login POST with invalid credentials - donor', function(done){
    // Assuming that no other tests registered 11 char users.
    var unique_username = make_random_string(11);
    var unique_password = make_random_string(11);
    chai.request(server)
      .post('/login')
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Donor")
      .end(function (err, res) {
        expect(res).to.have.status(401);
        done();
      });
  });

// ============================================================================

  // Login POST with invalid credentials - recipient.
  it('/login POST with invalid credentials - recipient', function(done){
    // Assuming that no other tests registered 11 char users.
    var unique_username = make_random_string(11);
    var unique_password = make_random_string(11);
    chai.request(server)
      .post('/login')
      .field("username", unique_username)
      .field("password", unique_password)
      .field("role", "Recipient")
      .end(function (err, res) {
        expect(res).to.have.status(401);
        done();
      });
  });

});