import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {AnnouncementsStateType, AnnouncementsPatchType,
  AnnouncementListType, AnnouncementType, AnnouncementUpdateType, AnnouncementsType} from '~/reducers/main-function/announcer/announcements';
import { loadAnnouncementsHelper } from './announcements/helpers';
import { AnnouncerNavigationItemListType } from '~/reducers/main-function/announcer/announcer-navigation';
import moment from '~/lib/moment';

export interface UPDATE_ANNOUNCEMENTS_STATE extends SpecificActionType<"UPDATE_ANNOUNCEMENTS_STATE", AnnouncementsStateType>{}
export interface UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES extends SpecificActionType<"UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES", AnnouncementsPatchType>{}
export interface UPDATE_SELECTED_ANNOUNCEMENTS extends SpecificActionType<"UPDATE_SELECTED_ANNOUNCEMENTS", AnnouncementListType>{}
export interface ADD_TO_ANNOUNCEMENTS_SELECTED extends SpecificActionType<"ADD_TO_ANNOUNCEMENTS_SELECTED", AnnouncementType>{}
export interface REMOVE_FROM_ANNOUNCEMENTS_SELECTED extends SpecificActionType<"REMOVE_FROM_ANNOUNCEMENTS_SELECTED", AnnouncementType>{}
export interface SET_CURRENT_ANNOUNCEMENT extends SpecificActionType<"SET_CURRENT_ANNOUNCEMENT", AnnouncementType>{}
export interface UPDATE_ONE_ANNOUNCEMENT extends SpecificActionType<"UPDATE_ONE_ANNOUNCEMENT", {
  update: AnnouncementUpdateType,
  announcement: AnnouncementType
}>{}
export interface DELETE_ANNOUNCEMENT extends SpecificActionType<"DELETE_ANNOUNCEMENT", AnnouncementType>{}

//TODO notOverrideCurrent should go once the missing data in the current announcement is fixed
export interface LoadAnnouncementsTriggerType {
  (location:string, workspaceId?:number, notOverrideCurrent?: boolean, force?: boolean):AnyActionType
}

export interface LoadAnnouncementTriggerType {
  (location:string, announcementId:number):AnyActionType
}

export interface AddToAnnouncementsSelectedTriggerType {
  (announcement: AnnouncementType):AnyActionType
}

export interface RemoveFromAnnouncementsSelectedTriggerType {
  (announcement: AnnouncementType):AnyActionType
}

export interface UpdateAnnouncementTriggerType {
  (data:{
    announcement: AnnouncementType,
    update: AnnouncementUpdateType,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface DeleteAnnouncementTriggerType {
  (data: {
    announcement: AnnouncementType,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface DeleteSelectedAnnouncementsTriggerType {
  ():AnyActionType
}

export interface CreateAnnouncementTriggerType {
  (data: {
    announcement: {
      caption: string,
      content: string,
      endDate: string,
      publiclyVisible: boolean,
      startDate: string,
      userGroupEntityIds: Array<number>,
      workspaceEntityIds: Array<number>
    },
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

let loadAnnouncements:LoadAnnouncementsTriggerType = function loadAnnouncements(location, workspaceId, notOverrideCurrent, force){
  return loadAnnouncementsHelper.bind(this, location, workspaceId, notOverrideCurrent, force);
}
  
let loadAnnouncement:LoadAnnouncementTriggerType = function loadAnnouncement(location, announcementId){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let navigation:AnnouncerNavigationItemListType = state.announcerNavigation;
    let announcements:AnnouncementsType = state.announcements;
    
    let announcement:AnnouncementType = state.announcements.announcements.find((a:AnnouncementType)=>a.id === announcementId);
    try {
      if (!announcement){
        announcement = <AnnouncementType>await promisify(mApi().announcer.announcements.read(announcementId), 'callback')();
        //TODO we should be able to get the information of wheter there is an announcement later or not, trace all this
        //and remove the unnecessary code
        dispatch(loadAnnouncements(location, null, false, false));
      }
      
      dispatch({
        type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
        payload: {
          location,
          current: announcement
        }
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}

let addToAnnouncementsSelected:AddToAnnouncementsSelectedTriggerType = function addToAnnouncementsSelected(announcement){
  return {
    type: "ADD_TO_ANNOUNCEMENTS_SELECTED",
    payload: announcement
  }
}

let removeFromAnnouncementsSelected:RemoveFromAnnouncementsSelectedTriggerType = function removeFromAnnouncementsSelected(announcement){
  return {
    type: "REMOVE_FROM_ANNOUNCEMENTS_SELECTED",
    payload: announcement
  }
}

let updateAnnouncement:UpdateAnnouncementTriggerType = function updateAnnouncement(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;
    
    try {
      await promisify(mApi().announcer.announcements.update(data.announcement.id, data.update), 'callback')();
      
      let diff = moment(data.update.endDate).diff(moment(), 'days');
      if (announcements.location !== "active" && diff >= 0){
        location.hash = "#active";
      } else if (announcements.location !== "past" && diff < 0){
        location.hash = "#past";
      } else {
        dispatch({
          type: "UPDATE_ONE_ANNOUNCEMENT",
          payload: {
            update: <AnnouncementUpdateType>await promisify(mApi().announcer.announcements.read(data.announcement.id), 'callback')(),
            announcement: data.announcement
          }
        });
      }
      data.success();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail();
    }
  }
}

let deleteAnnouncement:DeleteAnnouncementTriggerType = function deleteAnnouncement(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;
    
    try {
      await promisify(mApi().announcer.announcements.del(data.announcement.id), 'callback')();
      dispatch({
        type: "DELETE_ANNOUNCEMENT",
        payload: data.announcement
      });
      data.success();
    } catch (err){
      data.fail();
    }
  }
}

let deleteSelectedAnnouncements:DeleteSelectedAnnouncementsTriggerType = function deleteSelectedAnnouncements(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;
    
    await Promise.all(announcements.selected.map(async (announcement)=>{
      try {
        await promisify(mApi().announcer.announcements.del(announcement.id), 'callback')();
        dispatch({
          type: "DELETE_ANNOUNCEMENT",
          payload: announcement
        });
      } catch(err){
        dispatch(notificationActions.displayNotification(err.message, 'error'));
      }
    }));
  }
}

let createAnnouncement:CreateAnnouncementTriggerType = function createAnnouncement(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;
    
    try {
      await promisify(mApi().announcer.announcements.create(data.announcement), 'callback')();
      
      let diff = moment(data.announcement.endDate).diff(moment(), 'days');
      if (announcements.location !== "active" && diff >= 0){
        location.hash = "#active";
      } else if (announcements.location !== "past" && diff < 0){
        location.hash = "#past";
      } else {
        //TODO why in the world the request to create the announcement does not return the created object?
        //I am forced to reload all the announcements due to being unable to know what was created
        dispatch(loadAnnouncements(announcements.location, null, true, true));
      }
      data.success();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail();
    }
  }
}
export {loadAnnouncements, addToAnnouncementsSelected, removeFromAnnouncementsSelected,
  updateAnnouncement, loadAnnouncement, deleteSelectedAnnouncements, deleteAnnouncement,
  createAnnouncement}
export default {loadAnnouncements, addToAnnouncementsSelected, removeFromAnnouncementsSelected,
  updateAnnouncement, loadAnnouncement, deleteSelectedAnnouncements, deleteAnnouncement,
  createAnnouncement}