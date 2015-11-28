var config = require('../config');
var mongoose = require('mongoose');
var logger = require('console-plus');

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
    logger.log("Starting the before hook");
    deleteAllDatabaseItems();
    logger.log("Ending the before hook");
    return done();
});

///////////////////////////////////////////////////////////////////////////////
// mocha hook which runs after each test
afterEach(function (done) {
    logger.log("Starting the afterEach hook");
    deleteAllDatabaseItems();
    logger.log("Ending the afterEach hook");
    return done();
});

///////////////////////////////////////////////////////////////////////////////
// mocha hook which runs after the last test
after(function (done) {
    logger.log("Starting the after hook");
    deleteAllDatabaseItems();
    mongoose.disconnect();
    logger.log("Ending the afterEach hook");
    return done();
});
