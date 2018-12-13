import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';
import {Action} from 'redux';
import { updateUnreadMessageThreadsCount } from '~/actions/main-function/messages';
import { StateType } from '~/reducers';
import { Store } from 'redux';
import $ from '~/lib/jquery';
import { updateStatusHasImage } from '~/actions/base/status';

export default function(store: Store<StateType>){
  let state:StateType = store.getState();
  
  let websocket = new Websocket(store, {
    "Communicator:newmessagereceived": {
      actions: [updateUnreadMessageThreadsCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:messageread": {
      actions: [updateUnreadMessageThreadsCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:threaddeleted": {
      actions: [updateUnreadMessageThreadsCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    }
  });
  
  if (state.status.isActiveUser){
    store.dispatch(<Action>updateUnreadMessageThreadsCount());
    
    if (state.status.loggedIn){
      mApi().chat.status.read().callback(function(err:Error, result:{mucNickName:string,enabled:boolean}) {
        if (result && result.enabled) {
          initializeChat(state, result.mucNickName);
        }
      });
    }
  }
  
  $.ajax({type:"HEAD", url: `${window.location.protocol}//${window.location.hostname}/rest/user/files/user/${state.status.userId}/identifier/profile-image-96`}).done(()=>{
    store.dispatch(<Action>updateStatusHasImage(true));
  });
  
  return websocket;
}

function initializeChat(state: StateType, mucNickName: string){
  let script = document.createElement("script");
  script.src = "//cdn.muikkuverkko.fi/libs/converse-muikku/1.1.8/converse-no-jquery.min.js";
  script.onload = ()=>{
    (<any>window).converse.initialize({
      bosh_service_url : '/http-bind/',
      authentication : "prebind",
      keepalive : true,
      prebind_url : "/rest/chat/prebind",
      jid: state.status.userId,
      auto_login : true,
      muc_domain : 'conference.' + location.hostname,
      muc_nickname : mucNickName,
      muc_show_join_leave: false,
      hide_muc_server : true,
      ping_interval: 45,
      auto_minimize: true,
      i18n: state.locales.current,
      hide_occupants:true,
      limit_room_controls:true,
      auto_list_rooms: true,
      show_checkbox_persistent: state.status.permissions["CREATE_PERMANENT_CHATROOM"]
    });
  }
  document.head.appendChild(script);
  
  let link = document.createElement("link");
  link.href = "//cdn.muikkuverkko.fi/libs/converse-muikku/1.1.8/converse.min.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}