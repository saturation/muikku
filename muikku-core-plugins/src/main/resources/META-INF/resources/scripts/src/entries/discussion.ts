import App from '~/containers/discussion';
import reducer from '~/reducers/discussion';
import runApp from '~/run';
import Websocket from '~/util/websocket';
import {Action} from 'redux';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';
import {loadDiscussionAreas} from '~/actions/main-function/discussion/discussion-areas';
import {loadDiscussionThreads, loadDiscussionThread} from '~/actions/main-function/discussion/discussion-threads';

let store = runApp(reducer, App);
let websocket = new Websocket(store, {
  "Communicator:newmessagereceived": {
    actions: [actions.messageCount.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)]
  },
  "Communicator:messageread": {
    actions: [actions.messageCount.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)]
  },
  "Communicator:threaddeleted": {
    actions: [actions.messageCount.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)]
  }
});
store.dispatch(<Action>actions.messageCount.updateMessageCount());
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.forum.pageTitle')));

store.dispatch(<Action>loadDiscussionAreas(()=>{
  //here in the callback
  let currentLocation = window.location.hash.replace("#","").split("/");
  loadLocation(currentLocation);
}));

//NOTE because loadDiscussionThreads can only run after areas have been loaded, this needs to be so
function loadLocation(location: string[]){
  if (location.length <= 2){
    //The link is expected to be like # none, in this case it will collapse to null, page 1
    //Else it can be #1 in that case it will collapse to area 1, page 1
    //Or otherwise #1/2 in that case it will collapse to area 1 page 2
    
    store.dispatch(<Action>loadDiscussionThreads({
      areaId: parseInt(location[0]) || null,
      page: parseInt(location[1]) || 1
    }));
  } else {
    //There will always be an areaId and page designed #1/2/3 where then 3 is the threaid
    //and there can be a page as #1/2/3/4
    store.dispatch(<Action>loadDiscussionThread({
      areaId: parseInt(location[0]),
      page: parseInt(location[1]),
      threadId: parseInt(location[2]),
      threadPage: parseInt(location[3]) || 1
    }));
  }
}
window.addEventListener("hashchange", ()=>{
  let newLocation: string[] = window.location.hash.replace("#","").split("/");
  loadLocation(newLocation);
}, false);