$( document ).ready(function() {
    $.get("/savedPopulate", function(data) {
        // console.log('called');
		// $("#saved").empty();
		console.log(data)
        $("#saved").empty();
        for (var i = 0; i < data.length; i++) {
			if(data[i].note.length > 0){
				$("#saved").append("<ul id='articleList'><li id='"+data[i]._id+"' class='title list-group-item active' data-id='" + data[i]._id + "'>" + data[i].title + "<button id='deleteBtn' class='btn btn-danger'><i class='fa fa-trash'></i></button><button id='noteBtn' class='btn btn-success'>Add Note</button><button data-id='" + data[i]._id + "' id='viewNotes' class='btn btn-info'>Notes</button></li><li id='link' class='list-group-item'>" + data[i].link + "</li></ul>");
			}else{
				$("#saved").append("<ul id='articleList'><li id='"+data[i]._id+"' class='title list-group-item active' data-id='" + data[i]._id + "'>" + data[i].title + "<button id='deleteBtn' class='btn btn-danger'><i class='fa fa-trash'></i></button><button id='noteBtn' class='btn btn-success'>Add Note</button></li><li id='link' class='list-group-item'>" + data[i].link + "</li></ul>");
			}
            
        }
  	});

    $(document).on("click", "#noteBtn", function() {
    	var noteId = $(this).parent().attr('data-id');
    	// console.log(noteId);
    	// $.get("/articles/" + noteId, function(data) {
		//   console.log(data);
		//   if (data.note == undefined) {
		//   	$("#notes").text('No notes for this article.');
		//   }else{
		  	
		//   		var xbtn = $("<button data-id='"+data.note._id+"' id='xbtn' class='closeBtn btn btn-danger'>X</button>");
		//   		$("#notes").html(data.note.note);
		//   		$("#notes").append(xbtn);
		  	
		//   }
		 
		// });

    	// var noteId = $(this).parent().attr('data-id');
    	$(".save-modal-title").text('Notes For Article ' + noteId);
    	$("#saveNote").attr('data-id', noteId);
  	    $("#save").show();
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
		      console.log(data)
		    // populate();
			$("#noteData").empty();
			
			// $("#")<button id='noteBtn' class='btn btn-success'>Add Note</button>
			// console.log('finished');
			console.log('adding btn')
			console.log(artId)
			console.log($("#"+artId).find('#viewNotes').length)
			if(!$("#"+artId).find('#viewNotes').length){
				$("#"+artId).append("<button data-id='" + artId + "' id='viewNotes' class='btn btn-info'>Notes</button>")
			}
			// $('#elemId').length
			// $("#"+artId).append("<button data-id='" + artId + "' id='viewNotes' class='btn btn-info'>Notes</button>")
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