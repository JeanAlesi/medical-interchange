var mongoose = require('mongoose');

// utility function which deletes all items in the database.
function deleteAllDatabaseItems()
{
    // for each item in the database
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
}

before(function (done) {
    console.log("before");
    deleteAllDatabaseItems();
    return done();
});

after(function (done) {
    console.log("after");
    deleteAllDatabaseItems();
    return done();
});

afterEach(function(done) {
    console.log("afterEach");
    deleteAllDatabaseItems();
    return done();
});
