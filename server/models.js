
'use strict';
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

const promptSchema = mongoose.Schema({
  prompt: {type: String, required: true},
  response: {} 
});

promptSchema.method.apiRepr = function () {
  return {
    prompt: this.prompt,
    response: this.response
  };
};


const User = mongoose.model('User', userSchema);
const Prompts = mongoose.model('Prompts', promptSchema);

module.exports = {User, Prompts};