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


// ==================================================
// ROUTES FOR: /api/users/:user_id
// ==================================================
router.route('/:user_id')
  //GET - single user at /api/users/:user_id
  .get(function(req,res){
    User.findById(req.params.user_id, function(err, user){
      // Send errors if any
      if(err) res.send(err);
      // respond with ther user
      res.json(user);
    });
  })
  //Update - single user at /api/users/:user_id
  .put(function(req,res){
    User.findById(req.params.user_id, function(err, user){
      // Send errors if any
      if(err) res.send(err);

      if(req.body.name) user.name = req.body.name;
      if(req.body.username) user.username = req.body.username;
      if(req.body.email) user.email = req.body.email;
      if(req.body.password) user.password = req.body.password;
      if(req.body.highestScore && user.highestScore < req.body.highestScore) user.highestScore = req.body.highestScore;
      if(req.body.mostKills && user.mostKills < req.body.mostKills) user.mostKills = req.body.mostKills;

      user.save(function(err){
        if (err) {
          res.send(err);
        }
        res.json({success: true, message: "Successfully updated account info!"});
      });


    });
  })
  //Delete - single user at /api/users/:user_id
  .delete(function(req,res){
    User.remove({_id: req.params.user_id}, function(err){
      // Send any errors
      if(err) res.send(err);
      // Send success response
      res.json({success: true, message: "Account has been Deleted!"});
    });
  });

// export instance of Router
module.exports = router;
