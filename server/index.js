'use strict';
const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');

const {User, Prompts} = require('./models.js');
const { PORT, DATABASE_URL } = require('./config.js');

let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};

if (process.env.NODE_ENV != 'production') {
  secret = require('./secret');
}

const app = express();

app.use(passport.initialize());

passport.use(
  new GoogleStrategy({
    clientID: secret.CLIENT_ID,
    clientSecret: secret.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOne({ googleId: profile.id })
      .exec()
      .then(_user => {
        console.log('look here: ', _user);
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
      User.findOne({ accessToken }, function (err, user) {
        if (err) { return done(err); }
        if (!(user)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
);

app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/api/auth/google/callback',
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
  res.clearCookie('accessToken');    //add an anchor tag for this URL or event listener one a button
  res.redirect('/');
});

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
  (req, res) => {
    Prompts
      .find()
      .exec()
      .then(prompt =>{
        // console.log('PROMPT: ', prompt[0]);
        //prompt.map(item => {
          //console.log('ITEM',item);
          for(let i=0;i<prompt.length; i++){
              return res.status(200).json(prompt[i]);
          }
        })
        // res.json(prompt.map());
      // })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

// Post endpoint for user responses
app.post('/api/questions/next', 
  passport.authenticate('bearer', { sesison: false }),
  (req, res) => {
    console.log('we reached the post endpoint');
    res.json(['firstName', 'email']);

  }
);

// //---POST---[ADDING USER]---

app.post('/api/auth/google', 
  passport.authenticate('bearer', { sesison: false }),
  (req, res) => res.json(['firstName', 'email']));

//   //---POST---[ACTION]---


//   //---POST---[ACTION]---



//   //---PUT---[USER]---

//   //---PUT---[QUESTIONS]---


//   //---DELETE---[REMOVE USER]---

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
