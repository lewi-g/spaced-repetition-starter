'use strict';
const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');


const  User = require('./models.js');
const { PORT, DATABASE_URL } = require('./config.js');


let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};

if(process.env.NODE_ENV != 'production') {
  secret = require('./secret');
}

const app = express();

const database = {
};

app.use(passport.initialize());

passport.use(
  new GoogleStrategy({
    clientID:  secret.CLIENT_ID,
    clientSecret: secret.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
		// console.log(accessToken,'refreshToken', refreshToken, 'profile', profile)
		User.create({
			googleId: profile.id,
			accessToken: accessToken
		}, (err, user) => {
      return cb(err, user);
    })
		// console.log('profile', profile.id)
    // Job 1: Set up Mongo/Mongoose, create a User model which store the
    // google id, and the access token
    // Job 2: Update this callback to either update or create the user
    // so it contains the correct access token
    // if access token = refresh token then continue progress
    // if access token !== refresh token then create a new user 
    // accessToken given by Google
    // look into database and find a matching google ID -- have we seen them before

    // 1. find google ID
    // 2. console.log to see if they exist
    // 2a. Should start with saying THEY DONT EXIST
    // 3. IF THEY DONT EXIST -- CREATE THEM
    //Users.findOne
    const user = database[accessToken] = {
      googleId: profile.id,
      accessToken: accessToken
    };
    return cb(null, user);
  }
  ));

passport.use(
  new BearerStrategy(
    (token, done) => {
      // Job 3: Update this callback to try to find a user with a
      // matching access token.  If they exist, let em in, if not,
      // don't.
      if (!(token in database)) {
        return done(null, false);
      }
      return done(null, database[token]);
    }
  )
);

app.get('/api/auth/google',
  passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    res.cookie('accessToken', req.user.accessToken, {expires: 0});
    res.redirect('/');
  }
);

app.get('/api/auth/logout', (req, res) => {
  req.logout();
  res.clearCookie('accessToken');
  res.redirect('/');
});

app.get('/api/me',
  passport.authenticate('bearer', {session: false}),
  (req, res) => res.json({
    googleId: req.user.googleId
  })
);

app.get('/api/questions',
  passport.authenticate('bearer', {session: false}),
  (req, res) => res.json(['Question 1', 'Question 2'])
);

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
function runServer(databaseUrl='mongodb://space_dev:1@ds133094.mlab.com:33094/google_auth', port=3001) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
    });
    server = app.listen(port, 'localhost',() => {
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
