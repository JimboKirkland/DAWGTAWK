//HEADLINE MODEL
// ==============

//MONGOOSE
var mongoose = require("mongoose");

// SCHEMA CLASS
var Schema = mongoose.Schema;

//HEADLINE SCHEMA
var headlineSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  }
});

// CREATE MODEL AND EXPORT MODULE OUT
var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;
