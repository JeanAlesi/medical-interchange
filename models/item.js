var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ItemConditions = ["New", "New - Expired", "Used - Like new", "Used - Great", "Used - Good", "Used - Fair", "Used - Poor" ];

var Item = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    numFiles : {type: Number, min: 0, max: 4, required: false},
    fileNames : {type: [Schema.ObjectId], required: false}
});

var ItemModel = mongoose.model('Item', Item);
ItemModel.ItemConditions = ItemConditions;
module.exports = ItemModel;
