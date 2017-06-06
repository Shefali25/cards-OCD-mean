'use strict';
var names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Card Schema
 */
var CardSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  currentProgress: {
    spades: [{
      type: String,
      enum: names
    }],
    hearts: [{
      type: String,
      enum: names
    }],
    clubs: [{
      type: String,
      enum: names
    }],
    diamonds: [{
      type: String,
      enum: names
    }],
    timeTakenInSeconds: {
      type: Number,
      default: 0
    },
    gameOver: {
      type: Boolean,
      default: false
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'user id not found',
    unique: true
  }
});

mongoose.model('Card', CardSchema);
