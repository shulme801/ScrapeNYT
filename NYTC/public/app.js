$(document).on("click", "#scrapeB", function(){

$.getJSON("/scrape", function(data) {
  // For each one
  $("#articles").html('');
  for (var i = 0; i < 10; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p id= "+data[i].id+">" + data[i].title + "<br />" + data[i].link + "</p>");
   $("#articles").append(
       "<button class="+"save"+" id= "+data[i].id+">" +"SAVE"+ "</button>");
  };

}) ;


$(document).on("click", ".save", 
	function() {
    console.log("client saving");
		 	var savedData = {};
		 	var toSave = (this.id); 	
		 	savedData.title = data[toSave].title;
		 	savedData.link = data[toSave].link;

			$.ajax({
				method: "POST",
				url: "/save",
				data: {
					title: savedData.title,
					link: savedData.link,
				}
			});
	});
});

$(document).on("click", "#allArt", function(){
	$.getJSON("/articles", function(data) {
	  // For each one
      $("#articles").html('');
	  for (var i = 0; i < 10; i++) {
	    // Display the apropos information on the page
	  $("#articles").append("<p id= "+data[i].id+">" + data[i].title + "<br />" + data[i].link + "</p>");
	  $("#articles").append("<button class="+"note"+" id= "+data[i].id+">" +"NOTES"+ "</button>");
    $("#articles").append("<p class="+"notes"+" id= "+data[i].id+">" +"My note"+ "</p>");
    
  };
	});
});



// Whenever someone clicks a p tag
$(document).on("click", ".note", function() {
  // Empty the notes from the note section
  $("#titleinput").empty();
  $("#bodyinput").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      //delete comment
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");      

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("id");

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
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// When you click the delete note button
$(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");



});

