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
}

///////////////////////////////////////////////////////////////////////////////
// mocha hook which runs before the first test
before(function (done) {
    deleteAllDatabaseItems();
    return done();
});

///////////////////////////////////////////////////////////////////////////////
// mocha hook which runs after each test
afterEach(function (done) {
    deleteAllDatabaseItems();
    return done();
});

///////////////////////////////////////////////////////////////////////////////
// mocha hook which runs after the last test
after(function (done) {
    deleteAllDatabaseItems()
    mongoose.disconnect();
    return done();
});
