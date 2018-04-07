//DEPENDENCIES
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

// INSTANTIATE
var app = express();

//EXPRESS ROUTER
var router = express.Router();

//ROUTE FILES THROUGH ROUTER
require("./config/routes")(router);

app.use(express.static(__dirname + "/public"));

//HANDLEBARS TO APP
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//BODYPARSER FOR JSON
app.use(bodyParser.urlencoded({
  extended: false
}));

//ROUTER MIDDLEWARE
app.use(router);


// USED DEPLOYED DATABASE OR LOCALHOST DB
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose to our database
mongoose.connect(db, function(error) {
  // ERRORS CONNECTING
  if (error) {
    console.log(error);
  }
  // SUCCESS
  else {
    console.log("mongoose connection is successful");
  }
});

// PORT LISTENING
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});
