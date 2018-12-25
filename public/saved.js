$( document ).ready(function() {
    $.get("/savedPopulate", function(data) {
        // console.log('called');
		// $("#saved").empty();
		console.log(data)
        $("#saved").empty();
        for (var i = 0; i < data.length; i++) {
          $("#saved").append("<ul id='articleList'><li id='title' class='list-group-item active' data-id='" + data[i]._id + "'>" + data[i].title + "<button id='deleteBtn' class='btn btn-danger'><i class='fa fa-trash'></i></button><button id='noteBtn' class='btn btn-success'>Add Note</button></li><li id='link' class='list-group-item'>" + data[i].link + "</li></ul>");
        }
  	});

    $(document).on("click", "#noteBtn", function() {
    	var noteId = $(this).parent().attr('data-id');
    	// console.log(noteId);
    	$.get("/articles/" + noteId, function(data) {
		  // console.log(data);
		  if (data.note == undefined) {
		  	$("#notes").text('No notes for this article.');
		  }else{
		  	
		  		var xbtn = $("<button data-id='"+data.note._id+"' id='xbtn' class='closeBtn btn btn-danger'>X</button>");
		  		$("#notes").html(data.note.note);
		  		$("#notes").append(xbtn);
		  	
		  }
		 
		});

    	// var noteId = $(this).parent().attr('data-id');
    	$(".modal-title").text('Notes For Article ' + noteId);
    	$("#saveNote").attr('data-id', noteId);
  	    $(".modal").show();
	});

	$(document).on("click", ".closeBtn", function() {
    	// $("#notes").empty();
    	$(".modal").hide();
    	// $("#noteData").html('');
	});

	$(document).on("click", "#saveNote", function() {
		var artId = $(this).attr('data-id');

		var noteVal = $("#noteData").val();
		$("#noteData").val('');
		$.ajax({
		    method: "POST",
		    url: "/articles/:" + artId,
		    data: {
		    	note : noteVal
		    }
		})
		// With that done, add the note information to the page
		.then(function(data) {
		      
		    // populate();
		    $("#noteData").empty();
		    // console.log('finished');
		})
	});

	$(document).on("click", "#deleteBtn", function() {
    	var artId = $(this).parent().attr('data-id');
    	// console.log(artId);
    	$(this).parent().parent().hide();
    	$.ajax({
		    method: "DELETE",
		    url: "/delete:" + artId
		})
		// With that done, add the note information to the page
		.then(function(data) {

		    console.log('deleted');
		    
		})
	});

	$(document).on("click", "#xbtn", function() {
    	var artId = $(this).attr('data-id');
  
    	$.ajax({
		    method: "DELETE",
		    url: "/noteDelete:" + artId
		})
		// With that done, add the note information to the page
		.then(function(data) {

		})
	});

});