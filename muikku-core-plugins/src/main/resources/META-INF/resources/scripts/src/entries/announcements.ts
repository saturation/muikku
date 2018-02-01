import App from '~/containers/announcements';
import reducer from '~/reducers/announcements';
import runApp from '~/run';
import mainFunctionDefault from '~/util/base-main-function';
import { Action } from 'redux';
import {updateAnnouncements} from '~/actions/main-function/announcements';
import {loadAnnouncement} from '~/actions/main-function/announcements/announcements';
import {AnnouncementListType} from '~/reducers/main-function/announcer/announcements';

let store = runApp(reducer, App);
mainFunctionDefault(store);

//XD this is too inneficient
//let urlString = window.location.search;
//let indexOf = urlString.indexOf('=') + 1;    
//let annnouncementId = parseInt(urlString.substring(indexOf));

//we are going to use the hash, the hash does not reload the resources, and because it's a simple number, we just use the number in the id as a path
//ofc I modified the index file to give the proper hash :3
function updateCurrentAnnouncementBasedOnLocation(defaultValue?:number){
  //so we are expecting soemthing like /announcements#4
  let annnouncementId:number = parseInt(window.location.hash.replace("#","").split("/")[0]) || defaultValue;

  //We might not have that number :< so we make it a condition
  if (annnouncementId){
    //TODO there's a bug (feature???) in the backend where it's not allowed to retrieve single announcements
    //right not this code works because of the memory efficient mechanism where it tries to retrieve it from
    //memory first, but it'd fail in other circumstances
    store.dispatch(<Action>loadAnnouncement(annnouncementId));
  }
}

store.dispatch(<Action>updateAnnouncements({hideWorkspaceAnnouncements: "false"}, (announcements:AnnouncementListType)=>{
  updateCurrentAnnouncementBasedOnLocation(announcements[0].id);
}));

window.addEventListener("hashchange", ()=>{updateCurrentAnnouncementBasedOnLocation()}, false);