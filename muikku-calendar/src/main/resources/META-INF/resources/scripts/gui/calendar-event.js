(function() {
 
  $(document).ready(function(){
    $('#agendaView').fullCalendar({
      firstDay: 1,
      defaultView : 'basicDay',
      header: false,
      timeFormat:{
        agenda: 'h:mm'
      }
    });

    loadFullCalendarEvents($('#agendaView'));
  });
  
})(this);  