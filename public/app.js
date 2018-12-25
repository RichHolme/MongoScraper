// Grab the articles as a json
$.get("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<ul id='articleList'><li id='title' class='list-group-item active' data-id='" + data[i]._id + "'>" + data[i].title + "<button id='saveBtn' class='btn btn-danger'>Save Article</button></li><li id='link' class='list-group-item'>" + data[i].link + "</li></ul>");
   
  }
});

$(document).on("click", "#savedHome", function() {
  
  $.ajax({
    method: "GET",
    url: "/saved"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      
    })

  
});

$(document).on("click", "#scrapeBtn", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
 
    .then(function(data) {
      console.log('scraped');
      // res.json(data);
      // window.location.reload();
      setTimeout(function(){ window.location.reload() }, 1500);
    })
});

// route to save an article
$(document).on("click", "#saveBtn", function() {
 
  var div = $(this).parent().parent();
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

