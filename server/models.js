//need to connect server.js to this 
//needt to export NOTES


const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleID: {type: String, required: true},
  accessToken: {type: String, required: true},
});

userSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
    googleID: this.googleID,
    // definition: this.defintion
  };
}; 


const User = mongoose.model('Note', userSchema);

module.exports = {User};