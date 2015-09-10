(function() {
  $(document).ready(function(){
    $('#dayView').fullCalendar({
      firstDay: 1,
      firstHour: 8,
      defaultView : 'agendaDay',
      firstDay : 0,
      header: false
      
    });
    
    loadFullCalendarEvents($('#dayView'));
  });
  
})(this);  
