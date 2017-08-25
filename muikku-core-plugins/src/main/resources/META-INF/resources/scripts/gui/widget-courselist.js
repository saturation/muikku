 
$(document).ready(function(){

  mApi().workspace.workspaces
    .read({ userId: MUIKKU_LOGGED_USER_ID })
    .on('$', $.proxy(function (workspace, workspaceCallback){
      var workspaceId = workspace.id; 
      
      mApi().guider.workspaces.activity
      .cacheClear()
      .read(workspaceId)
      .callback($.proxy(function (err, activity) {         
        workspace.donePercent = activity.evaluablesDonePercent;
        
        if (workspace.urlName === "tervetuloa-startup-high-shooliin"){
          workspace.indexNo = 0;
        }
        else if (workspace.urlName === "su2-startup-yrittajan-tietopaketti"){
          workspace.indexNo = 1;          
        }
        else if (workspace.urlName === "su1-startup-yrittajan-ajattelun-taidot"){
          workspace.indexNo = 2;          
        }
        else if (workspace.urlName === "su3-startup-yrittajan-projektikurssi"){
          workspace.indexNo = 3;          
        }        
        else {
          workspace.indexNo = 5;          
        }
             
        workspaceCallback();        
      }));
    },this))
    .callback( function (err, workspaces) { 
       
      function compare(a, b) {
        if (a.indexNo < b.indexNo) {
          return -1;
        }
        if (a.indexNo > b.indexNo) {
          return 1;
        }
        return 0;
      }
      
      workspaces.sort(compare);
      
    	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{    	  
    	  renderDustTemplate('frontpage/widget_workspaces.dust', {
        	isStudent: MUIKKU_LOGGED_USER.indexOf('STAFF') == -1,
          workspaces: workspaces
        },
        
        function (text) {
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

