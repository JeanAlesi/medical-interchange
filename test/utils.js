var config = require('../config');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

beforeEach(function (done) {

   for (var i in mongoose.connection.collections) {
     mongoose.connection.collections[i].remove(function() {});
   }
   return done();

});

afterEach(function (done) {
 mongoose.disconnect();
 return done();
});