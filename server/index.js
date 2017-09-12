'use strict';
const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');

const User = require('./models.js');
const { PORT, DATABASE_URL } = require('./config.js');

let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};

if (process.env.NODE_ENV != 'production') {
  secret = require('./secret');
}

const app = express();

// const database = {};

app.use(passport.initialize());

passport.use(
  new GoogleStrategy({
    clientID: secret.CLIENT_ID,
    clientSecret: secret.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    // console.log(accessToken,'refreshToken', refreshToken, 'profile', profile)

    // console.log('profile', profile.id)
    // Job 1: Set up Mongo/Mongoose, create a User model which store the
    // google id, and the access token
    // Job 2: Update this callback to either update or create the user
    // so it contains the correct access token
    // if access token = refresh token then continue progress
    // if access token !== refresh token then create a new user 
    // accessToken given by Google
    // look into database and find a matching google ID -- have we seen them before


    // 2. console.log to see if they exist
    // 2a. Should start with saying THEY DONT EXIST
    // 3. IF THEY DONT EXIST -- CREATE THEM
    //Users.findOne

    // let user = database[accessToken] = {
    //   googleId: profile.id,
    //   accessToken: accessToken
    // };


    // [User.findOne]==========================================

    User.findOne({ googleId: profile.id })
      .exec()
      .then(_user => {
        console.log('look here: ', _user);
        //  user = _user;
        if (!_user) {
          User.create({
            googleId: profile.id,
            accessToken: accessToken
          }, (err, _user) => {
            return cb(err, _user);
          });
          return cb(null, false, { message: 'User already exists' });
        }
        return cb(null, _user);
      });
  }
  ));

passport.use(
  new BearerStrategy(
    (accessToken, done) => {
      // Job 3: Update this callback to try to find a user with a
      // matching access token.  If they exist, let em in, if not,
      // don't
      User.findOne({ accessToken }, function (err, user) {
        if (err) { return done(err); }
        if (!(user)) {
          //find user with matching access token -- If you dont find them use next Line
          return done(null, false);
        }
        //find user with matching access token -- If you find them use next Line -- database[token] = user
        return done(null, user);
      });
    })
);



// user provide access token -- header with a Bearer token (password)
// token needs to match for access

// app.get('/api/auth/google', (req, res) => {
//   User
//     .find()
//     .then(Users => {
//       // console.log(Users);
//       res.status(200).json(Users); //Note is equal to the mongoose model being called in
//     })
//     .catch(err => {
//       // console.log('testing');
//       res.status(500).json({ message: 'Internal error from GET' });
//     });
// });


// app.get('/api/auth/google/callback', (req, res) => {
//   //console.log('get all is happening');
//   User
//     .findById()
//     .then(Users => {
//       // console.log(Notes);
//       res.status(200).json(Users);
//     })
//     .catch(err => {
//       // console.log('testing');
//       res.status(500).json({ message: 'Internal error from GET' });
//     });
// });





app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    res.cookie('accessToken', req.user.accessToken, { expires: 0 });
    res.redirect('/');
  }
);

app.get('/api/auth/logout', (req, res) => {
  req.logout();
  res.clearCookie('accessToken');
  res.redirect('/');
});

app.get('/qustions');

app.post('/questionsadd');
app.get('/api/me',
  passport.authenticate('bearer', { session: false }),  //Endpoints using the bearer token -- GET & POST
  (req, res) => res.json({                              //Get can pull LOTS of questions and run the algorithms, push large group to backen
    googleId: req.user.googleId                         //OR
  })                                                    // Get will pull one question at at time (easier) / have algorithm on the back
);
//algorithm would live in .GET
app.get('/api/questions',
  passport.authenticate('bearer', { session: false }),  //Endpoints using the bearer token 
  (req, res) => res.json(['Question 1', 'Question 2'])
);

// //---POST---[ADDING USER]---
// //TODO: I need to complete this post section 
// //FIXME: this is not done yet 



// app.post('/api/notes', (req, res) => { //this is the pose when we are clicking on the notes
//   console.log(req.body, 'requesting body');
//   Note
//     .create({
//       word: req.body.newNote.word,
//       definition: req.body.newNote.definition
//     })
//     .then(
//     note => {
//       res.status(201).json(note);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ message: 'Internal server error' });
//     });



app.post('/api/auth/google', passport.authenticate('bearer', { sesison: false }),
  (req, res) => res.json(['firstName', 'email']));

//   //---POST---[ACTION]---


//   //---POST---[ACTION]---



//   //---PUT---[USER]---
//   //TODO: This is where I need to edit the PUT secitons 
//   //FIXME: this is not done yet 
//   app.put('/', passport.authenticate('bearer', { sesison: false }),
//     (req, res) => res.json(['firstName', 'email']));

//   //---PUT---[QUESTIONS]---


//   //---DELETE---[REMOVE USER]---
//   //TODO: This is where I need to have the delete section 
//   //FIXME: this is not done yet 
//   app.delete('', passport.authenticate('bearer', { sesison: false }),
//     (req, res) => res.json(['firstName', 'email']));

//   //---DELETE---[REMOVE ACCESSTOKEN/REFRESHTOKEN]---





// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
  const index = path.resolve(__dirname, '../client/build', 'index.html');
  res.sendFile(index);
});

let server;
// function runServer() {
//     let databaseUri = 'mongodb:/space_dev:1@ds133094.mlab.com:33094/google_auth';
//     mongoose.Promise = global.Promise;
//     mongoose.connect(databaseUri).then(function() {
//      app.listen(3001, HOST, (err) => {

//         if (err) {
//             console.error(err);
//             return(err);
//         }
//         const host = HOST || 'localhost';
//         console.log(`Listening on ${host}:3001`);
//     });
//  });
// }
function runServer(databaseUrl = 'mongodb://space_dev:1@ds133094.mlab.com:33094/google_auth', port = 3001) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
    });
    server = app.listen(port, 'localhost', () => {
      resolve();
    }).on('error', reject);
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer();
}

module.exports = {
  app, runServer, closeServer
};
