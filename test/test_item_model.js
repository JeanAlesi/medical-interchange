//
// Test item model
//

var chai = require('chai');
var expect = require("chai").expect;
var assert = require("chai").assert;
var mongoose = require("mongoose");
var Item = require('../models/item')

describe("Item model", function(done) {

    // ============================================================================

    it("Add empty title", function(done) {
        var item = new Item({description:"boo",category:"Machinery",
                             condition:"New", user:"Atlanta"});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does exist
            expect(err).to.exist;
            done();
        });
    });

    // ============================================================================

    it("Add empty description", function(done) {
        var item = new Item({title:"boo",category:"Machinery",
                             condition:"Used - Great", user:"Atlanta"});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does exist
            expect(err).to.exist;
            done();
        });
    });

    // ============================================================================

    it("Add empty category", function(done) {
        var item = new Item({title:"boo",description:"blah",
                             condition:"Used - Great", user:"Atlanta", location:"la"});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does exist
            expect(err).to.exist;
            done();
        });
    });

    // ============================================================================

    it("Add empty condition", function(done) {
        var item = new Item({title:"boo",description:"blah",
                             category:"Machinery", user:"Atlanta"});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does exist
            expect(err).to.exist;
            done();
        });
    });

    // ============================================================================

    it("Add empty user", function(done) {
        var item = new Item({title:"boo",description:"blah",
                             condition:"Used - Great",
                             category:"Machinery"});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does exist
            expect(err).to.exist;
            done();
        });
    });

    // ============================================================================

    it("Check item condition exists", function(done) {
        var item = new Item({title:"yo",description:"boo",
                             category:"Machinery",condition:"Used - Great",
                             user:"Atlanta"});
        expect(item.condition).to.equal("Used - Great");
        done();
    });

    // ============================================================================

    it("Test Single FileName Exists", function(done) {
        // generate a unique object ID to use as the file name
        var fileName = mongoose.Types.ObjectId();
        var item = new Item();
        item.title = "the item";
        item.description = "the description";
        item.category = "the category";
        item.condition = "Used - Poor";
        item.imageFileNames.push(fileName.toString());
        item.user = "Savannah";

        Item.create(item, function (err, createdItem) {
            expect(item.imageFileNames[item.imageFileNames.length - 1]).
                to.equal(fileName.toString());
            done();
        });
    });

    // ============================================================================

    it("Test Multiple FileNames Exist", function(done) {
        const MAX_NUM_FILES = 4;
        var savedFileNames = [mongoose.Types.ObjectId];
        var item = new Item();

        // save a list of unique object ID's for each file name
        for (i = 0; i < MAX_NUM_FILES; ++i){
            savedFileNames[i] = mongoose.Types.ObjectId().toString();
            item.imageFileNames.push(savedFileNames[i]);
        }

        // fill in the rest of the record
        item.title = "the item";
        item.description = "the description";
        item.category = "the category";
        item.condition = "Used - Poor";
        item.user = "Savannah";

        // create the item in the database
        Item.create(item, function (err, createdItem) {
            // verify that the file names exist
            for (i = 0; i < MAX_NUM_FILES; ++i){
                expect(item.imageFileNames[i]).to.equal(savedFileNames[i]);
            }
            done();
        });
    });

 // ============================================================================

    it("Accepts a correct enum value for condition", function(done) {
        var item = new Item({title:"boo",description:"blah",category:"Machinery",
                             condition:Item.ItemConditions[0], user:"Atlanta", location:'la'});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does not exist
            assert.isNull(err);
            done();
        });
    });

    it("Does not accept an invalid enum value for condition", function(done) {
        var item = new Item({title:"boo",description:"blah",
                             category:"Machinery", condition:"Invalid",
                             user:"Charlotte"});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does exist
            expect(err).to.exist;
            done();
        });
    });

    it("Does not accept an invalid form of an enum value", function(done) {
        var item = new Item({title:"boo",description:"blah",
                             category:"Machinery",
                             condition:Item.ItemConditions[0].toLowerCase(),
                             user:"Savannah"});
        Item.create(item, function (err, createdItem) {
            // Confirm that an error does exist
            expect(err).to.exist;
            done();
        });
    });
});
