var config = require('../config');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

before(function (done) {

   for (var i in mongoose.connection.collections) {
     mongoose.connection.collections[i].remove(function() {});
   }
   return done();

});

after(function (done) {
 mongoose.disconnect();
 return done();
});
