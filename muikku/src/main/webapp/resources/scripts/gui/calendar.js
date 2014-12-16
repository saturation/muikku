 
$(document).ready(function(){

	$(".bt-mainFunction").m3modal({
	        		title : "Uusi tapahtuma! ",
	        		description : "Uuden tapahtuman luonti",
	        		content: $('<div><div><select name="eventTemplates"><option>Ei pohjia</option></select></div><div><div><input type="textfield" value="osallistujat" name="eventParticipants"></input></div><div><input type="textfield" value="Tapahtuman nimi" name="eventSubject"></input></div></div><div><textarea value="Tapahtuman kuvaus" name="eventContent"></textarea></div></div>'),
	        		modalgrid : 24,
	        		contentgrid : 24,
	     		
	        		options: [
						{
						    caption: "Koko päivän tapahtuma",
							name : "whole day",
							type : "checkbox",
							action: function (e) {			
											}
						},
								
							 ],
	            		
	        	    buttons: [
	        		  {
	        		    caption: "Luo tapahtuma",
	        		    name : "sendMail",
	        		    action: function (e) {
	        
	        		    }
	        		  },
	        		  {
	            		 caption: "Älä luo tapahtumaa",
	            		 name : "saveMail",
	            		 action: function (e) {
	            
	            		}
	        		  }
	        		]
	        	});
	
	var cLang = 'fi';
	var td = new Date();
	var tdD = td.getDate();
	var tdDN = td.getDay();

	var tdT = td.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	
	var tdDDiv = $(".ca-date-primary span");
    var tdNDiv = $(".ca-date-day-name span");
	var tdTDiv = $(".ca-date-day-time span");
	
	function removeHeader(container){
		  var hdr = $(container).find('.fc-header');
	     hdr.remove();			
			
		}    
    
	
	$('#smallMonthCalendar').fullCalendar({
		
	  header:{
		  left: 'prev',
		  center: 'title',
		  right: 'next'
	  },	
	  titleFormat:{
		  month: 'MMMM'
		  
	  },
	    	  
	  
	});

	
	$('#fpDayEvents').fullCalendar({

	  defaultView : 'basicDay',  	
	  
 
	  
	});

	removeHeader('#fpDayEvents');
	
	$('#fpWeekView').fullCalendar({

		
		
		  defaultView : 'agendaWeek',  	
		  columnFormat:{
			  week: 'ddd',
	
		  },
		  contentHeight: 500,
		  
			events: [
						{
							title: 'All Day Event',
							start: '2014-12-01'
						},
						{
							title: 'Long Event',
							start: '2014-12-07',
							end: '2014-12-10'
						},
			
						{
							id: 999,
							title: 'Repeating Event',
							start: '2014-12-16T16:00:00'
						},
						{
							title: 'Meeting',
							start: '2014-12-15T10:30:00',
							end: '2014-12-15T12:30:00'
						},
						{
							title: 'Lunch',
							start: '2014-12-16T12:00:00'
						},
						{
							title: 'Birthday Party',
							start: '2014-12-17T07:00:00'
						},
						{
							title: 'Click for Google',
							url: 'http://google.com/',
							start: '2014-12-28'
						}
					]		  
		  
		});
	
		removeHeader('#fpWeekView');


	
	
	tdDDiv.append(tdD);
	tdNDiv.append("Päivä " + tdDN);
	tdTDiv.append(tdT);
    
	
	/* Day view */
	
	$('#dayView').fullCalendar({

		  defaultView : 'agendaDay',  	
		  
	});
	removeHeader('#dayView');	
	

	/*Week view */
	
	$('#weekView').fullCalendar({

		  defaultView : 'basicWeek',  	
		  
		  header:{
			  left: '',
			  center: 'title',
			  right: ''
		  },	
		  
	});	

	
	/*Month view */
	
	$('#monthView').fullCalendar({

		  header:{
			  left: '',
			  center: 'title',
			  right: ''
		  },	
	});	

	
	/*Agenda view */
	
	$('#agendaView').fullCalendar({
		
		defaultView : 'basicDay',
		  
	});		
	
	removeHeader('#agendaView');
    
	});

