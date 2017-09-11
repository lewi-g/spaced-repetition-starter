'use strict';

require('dotenv').config(); // converts .env file into an object: process.env


exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  'mongodb://localhost/spaced-repetition-starter';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-spaced-repetition-starter';
exports.PORT = process.env.PORT || 3001;

// console.log('mLab', exports.DATABASE_URL);


