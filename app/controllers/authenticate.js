// app/controllers/authenticate.js
var express       = require('express');
var router        = express.Router();
var User          = require('../models/user');
var jwt           = require('jsonwebtoken');
var config        = require('../../config');
var secret        = config.secret;


// ==================================================
// ROUTE FOR: AUTHENTICATION
// ==================================================
router.post('/', function(req,res){
  User.findOne({username: req.body.username})
    .select('name username email password')
    .exec(function(err, user){
      if(err) throw err;

      // Send repsonse if user is not found
      if(!user){
        res.json({success: false, message: 'Authentication failed. User not found.'});
      }else if (user) {

        // check for a password match
        var validPassword = user.comparePassword(req.body.password);

        if(!validPassword){
          res.json({success: false, message: 'Authentication failed. Incorrect password.'});
        }else {
          // if there is a user found and password is valid
          var token = jwt.sign({
            name: user.name,
            username: user.username,
            email: user.email},
            secret,
            {expiresIn: '1h'}
          );// end token

          res.json({success: true, message: 'Here is your token!', token: token});

        }// end if valid
      } // end if user
    });
});


// export moudle
module.exports = router;
