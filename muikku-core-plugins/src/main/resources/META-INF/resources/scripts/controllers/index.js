loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf",
  
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-announcements.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-important.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-last-messages.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-workspaces.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/index/panel-continue-studies.js.jsf"
], function(){
  $(document).muikkuWebSocket();
  $(document.body).baseControllerWidget();
  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
  $.getWidgetContainerFor("panel-announcements").panelAnnouncementsControllerWidget();
  $.getWidgetContainerFor("panel-continue-studies").panelContinueStudiesControllerWidget();
  $.getWidgetContainerFor("panel-important").panelImportantControllerWidget();
  $.getWidgetContainerFor("panel-last-messages").panelMessagesControllerWidget();
  $.getWidgetContainerFor("panel-workspaces").panelWorkspacesControllerWidget();
});