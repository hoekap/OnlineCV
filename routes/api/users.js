const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const generator = require("generate-password");

const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/User");

// Register route
router.post("/register", passport.authenticate("jwt", { session: false }),
(req, res) => {
  if (!req.user.isAdmin) {
    return res.status(401).json({
      error: "Not an admin"
    });
  }
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      return res.status(400).json({ username: "Username already exists." });
    }
    const newPassword = generator.generate({ length: 40, numbers: true,
      symbols: true });
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: newPassword
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save( (err, user) => {
          if (err) {
            console.log(err);
          }
          else {
            res.json({ newUser: newUser });
          }
        });
      });
    });
  });

});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({error: "Something went wrong."});
    }
    else if (!user) {
      return res.status(401).json({error: "Username or password is incorrect"});
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) {
        return res.status(401).json({error: "Username or password is incorrect"});
      }
      const payload = {
        username: user.username,
        name: user.name,
        id: user.id,
        isAdmin: user.isAdmin
      };

      jwt.sign(payload, keys.secretOrKey, {
        expiresIn: "24h"
      },
      (err, token) => {
        res.cookie("jwt", token);
        res.json({
          success: true,
          payload: payload
        });
      });
    });
  });
});

router.post("/logout", passport.authenticate("jwt", { session:false }),
(req, res) => {
  res.clearCookie("jwt");
  res.json({ success: true });
});

router.get( "/currentuser", passport.authenticate("jwt", { session: false }),
(req, res) => {
  res.json({
    username: req.user.username,
    name: req.user.name
  });
});

router.get("/projectdata", passport.authenticate("jwt", { session: false }),
(req, res) => {
  if (!req.user.isAdmin) {
    return res.status(401).json({
      error: "Not an admin"
    });
  }
  res.json({ success: true });
});


module.exports = router;
