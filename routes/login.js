var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

module.exports = function (app) {

  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', {roles: Account.Roles });
  });

  app.post('/register', function(req, res) {
      Account.register(new Account({ username : req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phonenumber: req.body.phonenumber, role : req.body.role }), req.body.password, function(err, account) {
          if (err) {
              return res.render('register', { account : account });
          }

          passport.authenticate('local')(req, res, function () {
              res.redirect('/');
          });
      });
  });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.render('index', { user : req.user });
      // res.redirect('/users/' + req.user.username);
  });


  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });
}
