var utils = require('./utils');
var expect    = require("chai").expect;
var mongoose = require("mongoose");
var Item = require('../models/item')

describe("Item model", function() {

    describe("Title must be present", function() {
        it("Add empty title", function() {
            var item = new Item({description:"boo",category:"Machinery",condition:"New"});
            Item.create(item, function (err, createdItem) {
                // Confirm that an error does exist
                expect(err).to.exist;
            });
        });
    });

    describe("Description must be present", function() {
        it("Add empty description", function() {
            var item = new Item({title:"boo",category:"Machinery",condition:"Used - Great"});
            Item.create(item, function (err, createdItem) {
                // Confirm that an error does exist
                expect(err).to.exist;
            });
        });
    });

    describe("Category must be present", function() {
        it("Add empty category", function() {
            var item = new Item({title:"boo",description:"blah",condition:"Used - Great"});
            Item.create(item, function (err, createdItem) {
                // Confirm that an error does exist
                expect(err).to.exist;
            });
        });
    });

    describe("Condition must be present", function() {
        it("Add empty condition", function() {
            var item = new Item({title:"boo",description:"blah",category:"Machinery"});
            Item.create(item, function (err, createdItem) {
                // Confirm that an error does exist
                expect(err).to.exist;
            });
        });
    });

    // to do: Change this test to accomodate the to be defined condition enumeration
    describe("Condition must be a valid condition", function() {
        it("Add conditions", function() {
            var item = new Item({title:"yo",description:"boo",category:"Machinery",condition:"Used - Great"});
            expect(item.condition).to.equal("Used - Great");
            // to do: Add Item.create to test that the database accepts the item
        });
    });

});
