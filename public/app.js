// Grab the articles as a json
$.get("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<ul id='articleList'><li id='title' class='list-group-item active' data-id='" + data[i]._id + "'>" + data[i].title + "<button id='saveBtn' class='btn btn-danger'>Save Article</button></li><li id='link' class='list-group-item'><a target='_blank' href=" + data[i].link + ">Click Here to Read the Article</a></li></ul>");
   
  }
});

$(document).on("click", "#savedHome", function() {
  
  $.ajax({
    method: "GET",
    url: "/saved"
  })
  // With that done, add the note information to the page
  .then(function(data) {
    // console.log(data)
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
    $("#modaltxt").empty()
    if(data == 0){
      $("#modaltxt").append('<p>' + data + ' new articles were added. </p>');
      $("#modaltxt").append('<p>All articles found have already been scraped</p>')
    }else{
      $("#modaltxt").text(data + ' new articles were added')
    }

    // $("#myModal").modal('show')
    // $('#myModal').modal('show')
    $(".modal").show();
    // $('#myModal').modal('show');s

    // setTimeout(function() {
    //   $('#myModal').modal('hide');
    // }, 1000);
    // setTimeout(function(){ window.location.reload() }, 1000);
    // $("#getCodeModal").modal('hide');
    console.log(data)
    // the findone check slowed things down so i put this delay on the reload
    setTimeout(function(){ window.location.reload() }, 3000);
    // window.location.reload()
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    console.log(err);
  });
});

// route to save an article
$(document).on("click", "#saveBtn", function() {
 
  var div = $(this).parent().parent();
  var article = {};

  div.each(function(index, value) {  
    console.log(div)
    // console.log($(value).children)
    currentValue = $(value).text();
    let link = $(this).children("#link").children('a').attr('href')
    article.title = currentValue.split('Save')[0];
    article.link = link;
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

$(document).on("click", ".closeBtn", function() {
  // $("#notes").empty();
  $(".modal").hide();
  // $("#noteData").html('');
});