(function() {
  $(document).ready(function(){
    $('#weekView').fullCalendar({
      firstDay: 1,
      defaultView : 'basicWeek',
      columnFormat : {
        week : 'ddd'
      },
      header: false
    });
    
    loadFullCalendarEvents($('#weekView'));
  });

})(this);