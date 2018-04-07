// SERVER ROUTES
// =============

var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
  //RENDER HOMEPAGE
  router.get("/", function(req, res) {
    res.render("home");
  });

  //SAVED HANDLEBARS PAGE
  router.get("/saved", function(req, res) {
    res.render("saved");
  });

  //SCRAPING MORE ARTICLES
  router.get("/api/fetch", function(req, res) {
    //SAVE UNIQUE ARTICLES AFTER SCRAPE
    headlinesController.fetch(function(err, docs) {
      // IF NO UNIQUE SEND MESSAGE
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today. Check back tomorrow!"
        });
      }
      else {
        // OTHERWISE SEND HOW MANY NEW ARTICLES
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });

  // GETTING HEADLINES
  router.get("/api/headlines", function(req, res) {
    // PASS IN WHAT HEADLINES WE WANT
    headlinesController.get(req.query, function(data) {
      res.json(data);
    });
  });

  //DELETE HEADLINE
  router.delete("/api/headlines/:id", function(req, res) {
    //_ID PROPERTY OF QUERY OBJECT TO PARAM 
    var query = { _id: req.params.id };

    // HEADLINES CONTROLLER DELETE METHOD FOR QUERY OBJECT WITH ID OF HEADLINE TO DELETE
    headlinesController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  // UPDATING HEADLINE OR SAVING
  router.put("/api/headlines", function(req, res) {

    headlinesController.update(req.body, function(err, data) {
      res.json(data);
    });
  });

  // NOTES FOR PARTICULAR ID
  router.get("/api/notes/", function(req, res) {
    //GET ALL NOTES
    notesController.get({}, function(err, data) {
      res.json(data);
    });
  });

  // GETTING NOTES FOR PARTICULAR ID
  router.get("/api/notes/:headline_id", function(req, res) {
    var query = { _id: req.params.headline_id };

    //NOTES THAT MATCH QUERY WITH NOTESCONTROLLER METHOD
    notesController.get(query, function(err, data) {
      res.json(data);
    });
  });

  //DELETE PARTICULAR ID NOTE
  router.delete("/api/notes/:id", function(req, res) {
    var query = { _id: req.params.id };

    // CHECK ARTICLES SORTED BY ID
    notesController.delete(query, function(err, data) {

      res.json(data);
    });
  });

  //SAVING NEW NOTE
  router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {
      res.json(data);
    });
  });
};
