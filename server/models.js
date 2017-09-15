'use strict';
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  displayName: String,
  googleId: {type: String, required: true},
  accessToken: {type: String, required: true},
  prompts: Array

});

//===============================================================
userSchema.methods.apiRepr = function(name) {
  let lowmValue = {mValue: Infinity}
  for (let i = 0; i < this.promps.length; i++) {
    if((this.prompts[i].mValue < lowmValue.mValue) && (this.promps[i].name !== name)) { // if brand new name is brought in 
      lowmValue = this.prompts[i]
    }
    else { // if the same name is sent in then I want to set it 
      
    }
  }
  return {
    letters: lowmValue.letters,
    atomic: lowmValue.atomic,
    name: lowmValue.name,
    questionId: lowmValue.questionId,
    mValue: lowmValue.mValue,
  };
};

//===============================================================

userSchema.methods.apiRepr = function(displayName) {
  return {
    _id: this._id,
    googleId: this.googleId, 
  };
};

const promptSchema = mongoose.Schema({
  prompt: {type: String, required: true},
  response: {},
  defaultOrder: Number,
  mValue: Number
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


//get displaying in frontend

//Lewi is getting the components together -- Header / login button / whats is our app about 

//Redux

//ike the algorithm

//or figuring out how to get more q;s to the DOM
