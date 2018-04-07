//NOTE MODEL
// ==========

//MONGOOSE
var mongoose = require("mongoose");
//CREATE SCHEMA CLASS
var Schema = mongoose.Schema;

// CREATE NOTESCHEMA
var noteSchema = new Schema({
  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },
  date: String,
  noteText: String
});

//CREATE MODEL AND EXPORT MODULE OUT
var Note = mongoose.model("Note", noteSchema);

module.exports = Note;
