var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true }
});

module.exports = mongoose.model('Item', Item);