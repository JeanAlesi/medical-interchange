var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ItemConditions = ["New", "New - Expired", "Used - Like new", "Used - Great", "Used - Good", "Used - Fair", "Used - Poor" ];

var Item = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true }
});

var ItemModel = mongoose.model('Item', Item);
ItemModel.ItemConditions = ItemConditions;
module.exports = ItemModel;
