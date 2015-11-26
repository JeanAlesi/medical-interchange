var config = require('../config');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

///////////////////////////////////////////////////////////////////////////////
// utility function which deletes all items in the database.
function deleteAllDatabaseItems()
{
    // for each item in the database
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    mongoose.disconnect();
}

///////////////////////////////////////////////////////////////////////////////
// mocha hook which runs before the first test runs
before(function (done) {
    deleteAllDatabaseItems();
    return done();
});

///////////////////////////////////////////////////////////////////////////////
// mocha hook which runs after each test runs
afterEach(function (done) {
    deleteAllDatabaseItems();
    return done();
});
