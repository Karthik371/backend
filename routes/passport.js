/** @format */
const LocalStratergy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

module.exports = (passport) => {
  passport.use(
    new LocalStratergy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) console.log(err);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) console.log(err);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (email, done) {
    User.findById(email, function (err, user) {
      done(err, user);
    });
  });
};
