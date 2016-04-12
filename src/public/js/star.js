(function(){
$('.colorStar').bind('click', function() {
				
				var id = $(this).parent().parent().parent().parent().attr('id');
				 
				var removeElement = $(this).parent();
			  	$(removeElement).empty();
			  	 $("<button data-action='show-contribute-how-to' class='btn colorStarred show'><i class='icon-star'></i></button>")
                 .click(function (){
 					var id = $(this).parent().parent().parent().parent().attr('id');
 					var removeElement = $(this).parent();
 				  	$(removeElement).empty();
 				    $(removeElement).append("<button data-action='show-contribute-how-to' class='btn colorStar show'><i class='icon-star'></i></button>");  
                 }).appendTo(removeElement);
			   
			});

$('.btn .colorStarred').on('click', function() {
				 alert("1");
			    var id = $(this).parent().parent().parent().parent().attr('id');
			    var removeElement = $(this).parent();
			    $(removeElement).empty();
                $(removeElement).append("<button data-action='show-contribute-how-to' class='btn colorStar colorOrange show'><i class='icon-star'></i></button>");
});
  }).call(this);
