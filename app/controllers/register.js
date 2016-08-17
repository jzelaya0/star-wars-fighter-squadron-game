// app/controllers/register.js
var express = require('express');
var router  = express.Router();
var User    = require('../models/user');

// ==================================================
// ROUTE FOR: /api/register
// ==================================================
router.post('/', function(req,res){
  // create new user instance
  var user = new User();

  // Attach user's info from body
  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;
  user.password = req.body.password;

  // Then save the attached user info
  user.save(function(err){
    if(err){
      // check for duplicate usernames or email addresses
      if(err.errors.username !== null || err.errors.email !== null){
        var username = err.errors.username;
        var email = err.errors.email;

        // Send errors of username or email
        return res.send({
          username_error: username,
          email_error: email
        });
      }
    }

    // Send success response
    res.json({success: true, message: "Success! Your account has been created!"});

  });// end save

});


module.exports = router;
