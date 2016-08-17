// app/middleware/token.js
var config     = require('../../config.js');
var jwt        = require('jsonwebtoken');
var User       = require('../models/user');
var bodyParser = require('body-parser');

// TOKEN MIDDLEWARE
// ==================================================
module.exports = function(req,res,next){
  // check Post params OR url params OR headers for TOKEN
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // Decode the token
  if(token){
    // Verify secret and expiration
    jwt.verify(token, config.secret, function(err, decoded){
      if(err){
        res.status(403).send({success: false, message: 'TOKEN AUTHENTICATION FAILED'});
      }else {
        req.decoded = decoded;
        // Get the user's info here
        User.findOne({username: decoded.username}, function(err, user){
          req.user = user;
          // Move on
          next();
        });
      }
    });
  }else {
    res.status(403).send({success: false, message: 'NO TOKEN PROVIDED'});
  }
};
