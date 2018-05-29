$( document ).ready(function() {
    $.get("/savedPopulate", function(data) {
        // console.log('called');
        // $("#saved").empty();
        $("#saved").empty();
        for (var i = 0; i < data.length; i++) {
          $("#saved").append("<ul id='articleList'><li id='title' class='list-group-item active' data-id='" + data[i]._id + "'>" + data[i].title + "<button id='deleteBtn' class='btn btn-danger'>Delete Fr`om Saved</button><button id='noteBtn' class='btn btn-success'>Add Note</button></li><li id='link' class='list-group-item'>" + data[i].link + "</li></ul>");
        }
  	});

    $(document).on("click", "#noteBtn", function() {
  	  $(".modal").show();
	});
});