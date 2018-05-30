// Grab the articles as a json
$.get("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p><p class='link'>" + data[i].link + "</p>");  
    $("#articles").append("<ul id='articleList'><li id='title' class='list-group-item active' data-id='" + data[i]._id + "'>" + data[i].title + "<button id='saveBtn' class='btn btn-danger'>Save Article</button></li><li id='link' class='list-group-item'>" + data[i].link + "</li></ul>");
    // $("#title").append("<button id='saveBtn' class='btn btn-primary'>Save Article</button>");
  }
});

$(document).on("click", "#savedHome", function() {
  
  // $.get("/saved", function(data) {
    
  // });
  // console.log('here');
  $.ajax({
    method: "GET",
    url: "/saved"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      
      // populate();
      
    })

  
});

$(document).on("click", "#scrapeBtn", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log('scraped');
      // res.json(data);
      location.reload();
    })
});

// route to save an article
$(document).on("click", ".btn-danger", function() {
 
  var div = $(this).parent().parent();
  // var id = $(this).parent().attr('data-id');
  // console.log(id);
  var article = {};

  div.each(function(index, value) {  
    currentValue = $(value).text();

    article.title = currentValue.split('Save')[0];
    article.link = currentValue.split('Article')[1];
    // article.id = $(this).parent().attr('data-id');
        
  });

  $.ajax({
    method: "POST",
    url: "/saveOne",
    data: article
  })
    .then(function(data) {
      console.log('saved');
    })
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});