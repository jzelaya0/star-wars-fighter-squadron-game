// app/controllers/users.js
var express     = require('express');
var router      = express.Router();
var User        = require('../models/user');
var tokenValidate = require('../middleware/token');

// Token middleware to pass through all routes
router.use(tokenValidate);

// ==================================================
// ROUTE FOR: /api/users/profile
// ==================================================
//GET - user's info
router.get('/profile', function(req,res){
  res.send(req.decoded);
});

// ==================================================
// ROUTES FOR: /api/users
// ==================================================
//GET - all users at /api/users
router.route('/')
  .get(function(req,res){
    User.find(function(err,users){
      // Send any errors
      if(err) res.send(err);
      // Response with all users found
      res.json(users);
    });
  });


// export instance of Router
module.exports = router;
