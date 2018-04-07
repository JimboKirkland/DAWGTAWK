//CONTROLLER FOR HEADLINES
// ============================

//SCRAPE AND MAKEDATES LOAD
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// BRING IN THE MODELS
var Headline = require("../models/Headline");

module.exports = {
  fetch: function(cb) {

    //RUN SCRAPE
    scrape(function(data) {
      var articles = data;
      //MAKE SURE ARTICLE HAS DATE AND IS NOT AUTO SAVED
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      //USE INSERTMANY SO IF SOME FAIL TO LOAD OTHERS CAN STILL DO SO 
      Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },
  get: function(query, cb) {
    //QUERY FROM DATA SCRAPED SORTED BY ID
    Headline.find(query)
      .sort({
        _id: -1
      })
      //EXECUTE
      .exec(function(err, doc) {
        // CALLBACK FUNCTION
        cb(doc);
      });
  },
  update: function(query, cb) {
    // UPDATE HEADLINE WITH THE ID AND PASS ANY QUERIES TO IT
    Headline.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};
