'use strict';
const path = require('path');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');

const { User, Prompts } = require('./models.js');
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
app.use(bodyParser.json());

passport.use(
  new GoogleStrategy({
    clientID: secret.CLIENT_ID,
    clientSecret: secret.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    User
      .findOne({ googleId: profile.id })
      .exec()
      .then(_user => {
        // console.log('look here: ', _user);
        if (!_user) {
          User
            .create({
              displayName: profile.displayName,
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
      User
        .findOne({ accessToken }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!(user)) {
            return done(null, false);
          }
          return done(null, user);
        });
    })
);

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

app.get('/api/me',
  passport.authenticate('bearer', { session: false }),  //Endpoints using the bearer token -- GET & POST
  (req, res) => res.json({                              //Get can pull LOTS of questions and run the algorithms, push large group to backen
    googleId: req.user.googleId                         //OR
  })                                                    // Get will pull one question at at time (easier) / have algorithm on the back
);

//algorithm would live in .GET
app.get('/api/questions',
  passport.authenticate('bearer', { session: false }), 
  (req, res) => {
    Prompts
      .find()
      .exec()
      .then(prompt => {
        // console.log('PROMPT: ', prompt);
        res.json(prompt);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

app.get('/api/questions', passport.authenticate('bearer', {session: false})),
  (req, res) => {
    User
      .find({googleId: req.user.googleId})
      .exec()
      .then(user => {
        let currentQuestion = {};
        res.status(200).json(req.Prompts);
        console.log('Prompt: ', Prompts);
      });
  };
//   //---Algorithm---[ACTION]---

//debug 
/**
 * get one question to show on the frontend at a time (grabbing 0 index) Prompts[0]/ finding a new question
 * If / Else -- correct or incorrect (where to place the 0 index)
 * correct -- back
 * incorrect -- swap 
 * 
 * for ( let i = 0) {
 * 
 * if ( answer === currentQuestionMap.response[i] )
 * 
 * }
 * 
 * if ( 
 *  ( answer === currentQuestionMap.response[0] ) || 
 *  ( answer === currentQuestionMap.response[1] )
 * ) {
 * 
 * }
 * 
 * for loop if there are 4 answers "responses "
 */
//array.push(array.shift()) -- shift to the back 
//array.splice(1, 0, array.pop())-- swap

//============================================================================
// const currentQuestionMap = {}

// app.get('/api/question',
//   passport.authenticate('bearer', {session: false}),
//   (req, res) => {
//     User
//     .findOne({ googleId: req.user.googleId })
//     .exec()
//     .then(user => {
//       let currentQuestion = {};
//       if (currentQuestionMap.hasOwnProperty(req.user.googleId)){
//         currentQuestion = user.apiRepr(currentQuestionMap[Prompts[0].prompt); //chemical element name
//       }
//       else{
//         currentQuestion = user.apiRepr('Non-existent Element');
//       }
//       currentQuestionMap[req.user[0].googleId] = currentQuestion;
//       res.json({letters: currentQuestion.letters, atomic: currentQuestion.atomic});
//     })
//     .catch(console.error)
// })

// app.put('/api/answer',
//   passport.authenticate('bearer', {session: false}),
//   (req, res) => {
//     const currentQuestion = currentQuestionMap[req.user[0].googleId];
//     if (req.body.answer.toLowerCase() === currentQuestion.name.toLowerCase()){
//       const search = {googleId: req.user[0].googleId, "questions.questionId": currentQuestion.questionId}
//       User
//       .findOneAndUpdate(search, {$mul: {"questions.$.mValue" : 2}}, {new: true})
//       .exec()
//       .then(user => {
//         res.json({correct: true, actualAnswer: currentQuestion.name});
//       })
//       .catch(console.error)
//     }
//     else {
//       const search = {googleId: req.user[0].googleId, "questions.questionId": currentQuestion.questionId}
//       User
//       .findOneAndUpdate(search, {$set: {"questions.$.mValue" : 1}}, {new: true})
//       .exec()
//       .then(user => {
//         res.json({correct: false, actualAnswer: currentQuestion.name});
//       })
//       .catch(console.error)
//     }
// })
//================================================================
// 
// app.post('/api/auth/google', passport.authenticate('bearer', { sesison: false }),
  // (req, res) => res.json(['firstName', 'email']));

// app.get('/api/user', (req, res) => {
//   User
//     .find()
//     .exec()
//     .then(_user => res.json(_user)
//       .catch(console.error)
//     );}
// );

// app.get('/api/user/:accessToken', (req, res) => {
//   User
//     .findOne()
//     .exec()
//     .then(data => res.json(data)
//       .catch(console.error)
//     );}
// );

// app.post('/api/user', (req, res) => {
//   console.log('THIS IS THE REQ BODY ----->: ',req.body);
//   User
//     .create({
//       displayName: req.body.displayName,
//       googleId: req.body.googleId,
//       accessToken: req.body.accessToken
//     })
//     .then(newUser => {
//       console.log('WHAT IS IN NEWUSER------>: ', newUser);
//       res.status(201).json(newUser);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({message: 'internal server error'});
//     });
// });



// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
  const index = path.resolve(__dirname, '../client/build', 'index.html');
  res.sendFile(index);
});

let server;
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
