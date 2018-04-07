// SCRAPE SCRIPT
// =============

//REQUEST AND CHEERIO FOR SCRAPING
var request = require("request");
var cheerio = require("cheerio");

// SCRAPES BULLDOG NEWS FROM SATURDAYDOWNSOUTH
var scrape = function(cb) {
  // TAKE IN BODY HTML
 request("https://www.saturdaydownsouth.com/georgia-bulldogs/", function(err, res, body) {
    //LOAD THE BODY HTML INTO CHEERIO

    // Saving this to $ creates a virtual HTML page we can minipulate and
    // traverse with the same methods we'd use in jQuery
    var $ = cheerio.load(body);

    // EMPTY ARRAY FOR ARTICLE INFO
    var articles = [];

    // FIND AND LOOP THROUGH EACH ELEMENT WITH "RECENT-ARTICLE-CONTENT" CLASS
   $(".recent-article-content").each(function(i, element) {
    
      //HEADLINE FROM ARTICLE
      var head = $(this).children(".recent-article-info").children("h3").children("span").children("a").text().trim();
      //var head = $(this).children(".cm-stream__item__content").children("h2").children("a").text().trim();

      // URL FROM ARTICLE
      var url = $(this).children(".recent-article-info").children("h3").children("span").children("a").attr("href");
      //var url = $(this).children(".cm-stream__item__content").children("h2").children("a").attr("href");

      // SUMMARY INFO FROM ARTICLE

      //var sum = $(this).children(".summary").text().trim();
      //var sum = $(this).children(".cm-stream__item__content").children("h2").children("p").text().trim();

      // IF HEADLINE AND URL ARENT EMPTY DO THE FOLLOWING
      //if (head && sum && url) {
        if (head && url) {
        // BELOW ARE REGEX EXPRESSIONS TO REMOVE UNNECESSARY ITEMS FROM HEADLINE AND URL AND SUMMARY.
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        //var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        //INITIALIZE OBJECT TO PUSH TO ARRAY

        var dataToAdd = {
          headline: head, //headNeat,
          //summary: sumNeat,
          url: url
        };

        articles.push(dataToAdd);
      }
    });
    //SEND BACK ARRAY OF ARTICLES TO CALLBACK FUNCTION
    cb(articles);
  });
};

// EXPORT MODULE
module.exports = scrape;
