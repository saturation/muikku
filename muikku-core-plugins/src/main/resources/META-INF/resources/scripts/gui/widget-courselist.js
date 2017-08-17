 
$(document).ready(function(){

    mApi({async: false}).workspace.workspaces
    .read({ userId: MUIKKU_LOGGED_USER_ID })
    .on('$', $.proxy(function (workspace, workspaceCallback){
      var workspaceId = workspace.id;
      
      mApi().guider.workspaces.activity
      .read(workspaceId)
      .callback($.proxy(function (err, activity) {         
        workspace.donePercent = activity.evaluablesDonePercent;
      }));
      workspaceCallback();
    },this))
    .callback( function (err, workspaces) {
      
    	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{    	  
    	  renderDustTemplate('frontpage/widget_workspaces.dust', {
        	workspaces:workspaces
        }, function (text) {
            $('#workspaces').append($.parseHTML(text));
            var is_xs = $(window).width() < 769;
            if (!is_xs) {
              $('#workspaces').perfectScrollbar({
                wheelSpeed:3,
                swipePropagation:false,
                wheelPropagation:true
              });
            }
          });
        
    	}
    });
});

