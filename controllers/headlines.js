// CONTROLLER FOR HEADLINES
// ============================

//SCRAPE AND MAKEDATE LOAD
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//BRING IN MODELS
var Headline = require("../models/Headline");

module.exports = {
  fetch: function(cb) {

    //RUN SCRAPE
    scrape(function(data) {
      var articles = data;
      //ENSURE ARTICLES HAVE DATES AND DONT AUTO SAVE THEM
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      // USING INSERTMANY SO THAT EVEN IF SOME FAIL TO LOAD IN OTHERS WILL CONTINUE TO BE ABLE TO DO SO
      Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },
  get: function(query, cb) {
    // PREPARE SCRAPE FROM DATA TO SORT BY MOST RECENT FOR ID
    Headline.find(query)
      .sort({
        _id: -1
      })
      //EXECUTE
      .exec(function(err, doc) {
        //CALLBACK FUNCTION
        cb(doc);
      });
  },
  update: function(query, cb) {
    // UPDATE HEADLINE WITH SUPPLIED ID
    Headline.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};
