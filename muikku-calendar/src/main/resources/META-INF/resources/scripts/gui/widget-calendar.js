 
$(document).ready(function(){

	$('#calendarWidget').fullCalendar({
		  firstDay: 1,
		  header:{
			  left: 'prev',
			  center: 'title',
			  right: 'next'
		  },	
		  titleFormat:{
			  month: 'MMMM'
			  
		  }
                  
		  
		});
	});

