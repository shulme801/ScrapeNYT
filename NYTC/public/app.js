
//$(document).on("click", "#scrapeB", function(){

$.getJSON("/scrape", function(data) {
  // For each one
  for (var i = 0; i < 10; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p id= "+data[i].id+">" + data[i].title + "<br />" + data[i].link + "</p>");
   $("#articles").append("<form role="+'form'+" >"
       +"<button class="+"save"+" id= "+data[i].id+">" +"SAVE"+ "</button>"+"</form>");
  };

// }) ;
		 $(document).on("click", ".save", function() {
		 	var savedData = {};
		 	var toSave = (this.id); 	
		 	savedData.title = data[toSave].title;
		 	savedData.link = data[toSave].link;

			$.ajax({
				method: "POST",
				url: "/save",
				data: {
					title: savedData.title,
					link: savedData.link
				}
			});
			
		});

});

$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < 10; i++) {
    // Display the apropos information on the page
  $("#articles").append("<p id= "+data[i].id+">" + data[i].title + "<br />" + data[i].link + "</p>");
};
});
