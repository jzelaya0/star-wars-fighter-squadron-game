// app/controllers/index.js
var express        = require('express');
var apiRouter      = express.Router();
var userRoute      = require('./users');
var registerRoute  = require('./register');
var authenticateRoute = require('./authenticate')

// ==============================
// GATHER ALL ROUTES HERE AND
// EXPORT FOR USE IN SERVER.JS
// ==============================

// Routes don't require token
apiRouter.get('/', function(req, res){
  res.json({message: "Welcome to the API"});
});
apiRouter.use('/authenticate', authenticateRoute);
apiRouter.use('/register', registerRoute);

// Routes require token
apiRouter.use('/users',userRoute);

// export all routes
module.exports = apiRouter;
