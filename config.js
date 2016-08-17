// config.js
var env = require('node-env-file');// require node-env-file module

// Grab environment variables
env(__dirname +  '/.env');

// export config properties
module.exports = {
  "db" : process.env.API_DB,
  "secret": process.env.API_SECRET,
  "port": process.env.PORT || 3000
};
