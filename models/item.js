var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Qualities = ['new', 'new expired', 'used like new', 'used great', 'used good', 'used fair', 'used poor'];

var Item = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String , enum: Qualities, required: true }
});

module.exports = mongoose.model('Item', Item);
