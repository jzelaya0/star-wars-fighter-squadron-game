// app/models/user.js
// Requirements for User Model
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var bcrypt          = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

// USER SCHEMA
// ==================================================
var UserSchema = new Schema({
  name: String,
  username: {type: String, requried: true, index: {unique: true}},//Prevent duplicate user names
  email: {type: String, requried: true, index: {unique: true}},//Prevent duplicate email addresses
  password: {type: String, required: true, select: false},//Prevent returning password on queries
  highestScore: Number,
  mostKills: Number
},
{
  timestamps: true
}
);


// PASWORD HASH
// ==================================================
// Before saving hash the password
UserSchema.pre('save', function(next){
  var user = this;

  // Hash password only if password is not new or changed
  if(!user.isModified('password')) return next();

  // Generate salt
  bcrypt.hash(user.password, null, null, function(err,hash){
    if(err) return next(err);

    // Hash the user password
    user.password = hash;
    next();
  });
});


//Method to compare user's typed password with one in database
UserSchema.methods.comparePassword = function(password){
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

//Use the uniqueValidator plugin
UserSchema.plugin(uniqueValidator);

// Create a user model from Schema
var User = mongoose.model('User', UserSchema);
//Export the user model
module.exports = User;
