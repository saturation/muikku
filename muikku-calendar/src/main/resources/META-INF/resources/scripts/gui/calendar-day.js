(function() {
  $(document).ready(function(){
    $('#dayView').fullCalendar({
      firstDay: 1,
      firstHour: 8,
      defaultView : 'agendaDay',
      header: false
    });
    
    loadFullCalendarEvents($('#dayView'));
  });
  
})(this);  