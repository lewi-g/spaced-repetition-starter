//need to connect server.js to this 
//needt to export NOTES


const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId: {type: String, required: true},
  accessToken: {type: String, required: true},
});

userSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
    googleId: this.googleId, //may need profile.id
    // definition: this.defintion
  };
}; 


const User = mongoose.model('Note', userSchema);

module.exports = {User};