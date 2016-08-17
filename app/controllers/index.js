// app/controllers/index.js
var express        = require('express');
var apiRouter      = express.Router();
var userRoute      = require('./users');
var registerRoute  = require('./register');

// ==============================
// GATHER ALL ROUTES HERE AND
// EXPORT FOR USE IN SERVER.JS
// ==============================

apiRouter.get('/', function(req, res){
  res.json({message: "Welcome to the API"});
});
// Routes require token
apiRouter.use('/register', registerRoute);
apiRouter.use('/users',userRoute);

// export all routes
module.exports = apiRouter;
