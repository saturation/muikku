(function() {
  function quickEvent(el, date){
    var mutter = $(el);
    mutter.fullCalendar("gotoDate", date);
  }  

  $(document).ready(function(){
    $('#monthView').fullCalendar({
      header: false,
      firstDay: 1,
      dayClick : function(date, ev, view) {
        quickEvent(this, date);
      }/*,
      eventClick: function(calev, ev, view) {
        var jaettuId = calev.id.split(':');
        $(document).trigger('eventClick', {
          calendarId: jaettuId[0],
          id: jaettuId[1]
        });
      } */
    });
    
    loadFullCalendarEvents($('#monthView'));
 });

})(this);