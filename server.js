// server.js
// ============================================================
// BASE SET UP
// ============================================================
var express          = require('express');
var app              = express();
var bodyParser       = require('body-parser');
var mongoose         = require('mongoose');
var config           = require('./config');
var morgan           = require('morgan');
var path             = require('path');

// ============================================================
// CONNECTION TO THE DATABASE
// ============================================================
mongoose.connect(config.db);

var db = mongoose.connection;
db.on("error",
  console.error.bind(console, "------------------ \n CONNECTION FAILED \n------------------ "));
db.once("open", function(){
  console.log("------------------ \n CONNECTED TO DATABASE \n------------------ ");
});

// ============================================================
// CONFIGURATIONS
// ============================================================

// ******************************
// MIDDLEWARE
// ******************************
// Use body-parser to grab info from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Handling for CORS
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});
app.use(morgan('dev')); // log http requests
app.use(express.static(__dirname + '/public'));// Use static file assests from Front End

// ******************************
// ROUTES
// ******************************

// Get all routes from /app/controllers/index.js
var apiRoutes = require("./app/controllers");

// prefix all routes with "api"
app.use('/api', apiRoutes);

// Send users to the front end
app.get('*', function(req,res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// ******************************
// START SERVER
// ******************************
app.listen(config.port);
console.log("Listening on PORT:", config.port);
