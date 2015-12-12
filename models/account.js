var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Roles = ["Donor", "Recipient", "Admin"];

var Account = new Schema({
    username: String,
    password: String,
    role: String,
    firstname: String,
    lastname: String,
    email: String,
    phonenumber: String
});

Account.plugin(passportLocalMongoose);

var AccountModel = mongoose.model('Account', Account);
AccountModel.Roles = Roles;
module.exports = AccountModel;
