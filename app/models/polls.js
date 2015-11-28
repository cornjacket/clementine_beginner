'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// in the future i would want the _id that is being used by the users table to be used in the poll table as the owner,
// but for now i can use the github id, and keep a github object inside the poll just for fun, as well as the displayName
// we are storing the displayName for each poll which is not needed.

var Poll = new Schema({
    github: {
        id: String,
        name: String,
        username: String
    },
   poll: {
      question: String,
      options:  [String], // each string is a separate option to vote on
      votes: [Number]  // for now this will be an array of 2 numbers indicating the pros and cons, later it should be an array of vote arrays
      // containing the id's of the users who voted for each option
   }
});

module.exports = mongoose.model('Poll', Poll);