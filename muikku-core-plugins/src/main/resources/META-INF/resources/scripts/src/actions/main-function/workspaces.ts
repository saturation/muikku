import actions from '../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {WorkspaceListType, ShortWorkspaceType} from '~/reducers/main-function/workspaces';
import { StateType } from '~/reducers';

export interface LoadWorkspacesFromServerTriggerType {
  ():AnyActionType
}

export type UPDATE_WORKSPACES = SpecificActionType<"UPDATE_WORKSPACES", WorkspaceListType>;
export type UPDATE_LAST_WORKSPACE = SpecificActionType<"UPDATE_LAST_WORKSPACE", ShortWorkspaceType>;

export type ACTIONS = UPDATE_WORKSPACES | UPDATE_LAST_WORKSPACE

let loadWorkspacesFromServer:LoadWorkspacesFromServerTriggerType = function loadWorkspacesFromServer(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let userId = getState().status.userId;
    try {
      dispatch({
        type: "UPDATE_WORKSPACES",
        payload: <WorkspaceListType>(await (promisify(mApi().workspace.workspaces.read({userId}), 'callback')()) || 0)
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.errormessage.workspaceLoadFailed"), 'error'));
    }
  }
}

export interface LoadLastWorkspaceFromServerTriggerType {
  ():AnyActionType
}

let loadLastWorkspaceFromServer:LoadLastWorkspaceFromServerTriggerType = function loadLastWorkspaceFromServer() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: 'UPDATE_LAST_WORKSPACE',
        payload: <ShortWorkspaceType>JSON.parse(((await promisify(mApi().user.property.read('last-workspace'), 'callback')()) as any).value)
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.errormessage.lastWorkspaceLoadFailed"), 'error'));
    }
  }
}

export default {loadWorkspacesFromServer, loadLastWorkspaceFromServer}
export {loadWorkspacesFromServer, loadLastWorkspaceFromServer}