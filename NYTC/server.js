// Dependencies--
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring our Note and Article models--
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/NYT");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// Routes
app.get("/", function (req, res) {
  res.send("index.html");
});


 var result = [];
app.get("/scrape", function (req, res) {
 
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:

    $("article h2").each(function (i, element) {

      var newArt = {
        id: i,
        title: $(this).children("a").text(),
        link: $(this).children("a").attr("href")
      };
      result.push(newArt);
    });
    console.log("Scraped");
    res.send(result);
    // res.sendFile('scraped.html', {root: __dirname+ "/public"});    
  });
});

//Save 
app.post("/save", function (req, res) {
  console.log("In save");
  var saveMe = {};
  saveMe.title = req.body.title;
  saveMe.link = req.body.link;
//  saveMe.note = [];
  var entry = new Article(saveMe);

  // Now, save that entry to the db
  entry.save(function (err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Or log the doc
    else {
      //  console.log(doc);
    }
  });
  console.log(entry);

});

app.get("/articles", function (req, res) {
  // Grab every doc in the Articles array
  console.log(" I'm looking for articles from server");
  var savedArticles = [];
  Article.find({}, function (error, doc) {
    for (i = 0; i < 10; i++) {
      var oneSavedArt = {
        title: (doc[i].title),
        id: (doc[i]._id),
        link: (doc[i].link),
      //  note: (doc[i].note)
      };
      savedArticles.push(oneSavedArt);
    };
    //console.log(savedArticles);
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.send(savedArticles);
      //res.sendFile('saved.html', {root: __dirname+ "/public"});
    }
  });
});

app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  console.log(req.params.id);
  Article.findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    // now, execute our query
    .exec(function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
});

// Create a new note or replace an existing  note
app.post("/articles/:id", function (req, res) {

  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);
  console.log(newNote);

  // And save the new note the db
  newNote.save(function (error, doc) {

    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {

       console.log(req.params.id);
       console.log(doc._id);
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: 
      { "note": doc._id }
      })
        // Execute the above query
        .exec(function (err, doc) {
                 console.log("here"); 
                 // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            // Or send the document to the browser
            res.send(doc);
          }
        });
    }
  });
});

app.post("/deletenote/:id", function (req, res) {
  console.log("DELETE");
  console.log(req.params.id);
  console.log(req.body.id);
      Note.findById( req.params.id, function(err, doc) {
        if(err){
          console.log(err);
        }
        console.log(doc)
       doc.remove(doc);
        console.log("Deleted");
      })
});






app.listen(3000, function () {
  console.log("App running on port 3000!");
});
