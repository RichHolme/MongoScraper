var express = require("express");
var bodyParser = require("body-parser");
// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var path = require('path')
var favicon = require('serve-favicon');

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

app.use(favicon(path.join(__dirname,'public', 'images', 'text-lines.png')));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticles) {
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);

       // First, we grab the body of the html with request
      axios.get("http://www.foxnews.com/politics.html").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // console.log(response.data);
        // Now, we grab every h2 within an article tag, and do the following:
        let stored = $('h4.title').length;
        console.log($('h4.title').length);
        $("h4.title").each(function(i, element) {

          
          var result = {};

          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this)
            .children("a")
            .text();
          result.link = $(this)
            .children("a")
            .attr("href");

          if(result.link != undefined){

            var found = false;
            if(!result.link.toString().includes('http')){
              result.link = 'https://www.foxnews.com' + result.link 
            }else{
              found = true;
              stored--;
            }

            for(var j = 0; j < dbArticles.length; j++) {
              if (dbArticles[j].title == result.title) {
                  found = true;
                  stored--;
                  break;
              }
            }

            if(!found){
              db.Article.create(result)
                .then(function(article) {
                })
                .catch(function(err) {
                  res.json(err);
                });
              }
            }
            
            // console.log(i)
            if(i == $('h4.title').length - 1){
              callback()
            }
        })
        
        function callback(){
            console.log('callback called')
            res.json(stored - 1)
        }

        // res.json(stored)
      })
      .catch(function(err){
        console.log(err)
      })
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/saveOne", function(req, res) {

  db.Saved.create(req.body)
    .then(function(dbSaved) {
  
    })
    .catch(function(err) {

      res.json(err);
    });
});


app.get("/saved", function(req, res) {
  // console.log('called');
  res.sendFile(__dirname + '/public/saved.html');

});

app.get("/savedPopulate", function(req, res) {

  db.Saved.find({})
    .then(function(dbSaved) {
      // console.log(dbSaved);
      res.json(dbSaved);
    })
    .catch(function(err) {

      res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Saved.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var id = req.params.id.split(":")[1];

  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log(id)
      return db.Saved.findOneAndUpdate({ _id: id }, {$push: { note: dbNote._id }});
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/delete:id", function(req, res) {
  // console.log(req.params.id);
  var id = req.params.id.split(":")[1];
  db.Saved.deleteOne({_id: id})
    .then(function(dbNote) {
      // console.log('deleted');
      console.log('delete saved called')
      // location.reload();
    })
});

app.delete("/noteDelete:id", function(req, res) {
  console.log('note id')
  console.log(req.params.id);  
  var id = req.params.id.split(":")[1];
  console.log(id)
  console.log('data id')
  console.log(req.body.article)

  db.Note.deleteOne({_id: id})
    .then(function(dbNote) {
      console.log('deletNote has been called')
    })

  db.Saved.update( {_id: req.body.article}, 
    { $pullAll: {note: [id] }})
    .then(function(note){
      console.log('note removed')})
    .catch(function(err){
      console.log(err)
    })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});