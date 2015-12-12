'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    github: {
        id: String,
        displayName: String,
        username: String,
      publicRepos: Number
    },
   polls: {
       num_created: Number,
       num_voted: Number
   },
   messageList: [],
   isAdmin:    Boolean,
   created_at: Date,
   updated_at: Date
});

// modified from https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
// on every save, add the date
User.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

module.exports = mongoose.model('User', User);