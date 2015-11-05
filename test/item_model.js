var expect    = require("chai").expect;
var mongoose = require("mongoose");
var Item = require('../models/item')

describe("Item model", function() {

  describe("Title must be present", function() {
    it("Add empty title", function() {
      var item = new Item({description:"boo",category:"Machinery",condition:"A"});
      Item.create(item, function (err, createdItem) {
       // Confirm that that an error does exist
       expect(err).to.exist;
     });
    });
  });

  describe("Description must be present", function() {
    it("Add empty description", function() {
      var item = new Item({title:"boo",category:"Machinery",condition:"A"});
      Item.create(item, function (err, createdItem) {
       // Confirm that that an error does exist
       expect(err).to.exist;
     });
    });
  });

  describe("Category must be present", function() {
    it("Add empty category", function() {
      var item = new Item({title:"boo",description:"blah",condition:"A"});
      Item.create(item, function (err, createdItem) {
       // Confirm that that an error does exist
       expect(err).to.exist;
     });
    });
  });

  describe("Condition must be present", function() {
    it("Add empty condition", function() {
      var item = new Item({title:"boo",description:"blah",category:"Machinery"});
      Item.create(item, function (err, createdItem) {
       // Confirm that that an error does exist
       expect(err).to.exist;
     });
    });
  });

  describe("Condition must be: A, B, C, D, F", function() {
    it("Add conditions", function() {
      var item = new Item({title:"yo",description:"boo",category:"Machinery",condition:"A"});
      expect(item.condition).to.equal("A");
    });
  });

});
