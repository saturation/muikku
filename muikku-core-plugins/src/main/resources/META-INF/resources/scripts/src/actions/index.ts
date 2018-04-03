export interface SpecificActionType<ActionType, PayloadType> {
  type: ActionType,
  payload: PayloadType | null
}

type dispatch = (action:any)=>any;
type getState = ()=>any;
type AsyncDeferredAction = (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>Promise<void>;
type DeferredAction = (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>any;

import {SET_LOCALE} from './base/locales';
import {ADD_NOTIFICATION, HIDE_NOTIFICATION} from './base/notifications';
import {LOGOUT} from './base/status';
import {UPDATE_TITLE} from './base/title';
import {SET_CURRENT_MESSAGE_THREAD, UPDATE_MESSAGES_STATE, UPDATE_MESSAGES_ALL_PROPERTIES,
  UPDATE_MESSAGE_ADD_LABEL, UPDATE_MESSAGE_DROP_LABEL, PUSH_ONE_MESSAGE_FIRST, LOCK_TOOLBAR, UNLOCK_TOOLBAR,
  UPDATE_ONE_MESSAGE, DELETE_MESSAGE, UPDATE_SIGNATURE, UPDATE_SELECTED_MESSAGES, ADD_TO_COMMUNICATOR_SELECTED_MESSAGES,
  REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES,
  PUSH_MESSAGE_LAST_IN_CURRENT_THREAD} from './main-function/communicator/communicator-messages';
import {UPDATE_COMMUNICATOR_NAVIGATION_LABELS, ADD_COMMUNICATOR_NAVIGATION_LABEL,
  UPDATE_ONE_LABEL_FROM_ALL_MESSAGES, UPDATE_COMMUNICATOR_NAVIGATION_LABEL,
  DELETE_COMMUNICATOR_NAVIGATION_LABEL, REMOVE_ONE_LABEL_FROM_ALL_MESSAGES} from './main-function/communicator/communicator-navigation';
import {UPDATE_MESSAGE_COUNT, UPDATE_MESSAGES} from './main-function/messages';
import {UPDATE_WORKSPACES, UPDATE_LAST_WORKSPACE} from './main-function/workspaces';
import {UPDATE_ANNOUNCEMENTS, UPDATE_ANNOUNCEMENTS_STATE, UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES, UPDATE_SELECTED_ANNOUNCEMENTS,
  ADD_TO_ANNOUNCEMENTS_SELECTED, REMOVE_FROM_ANNOUNCEMENTS_SELECTED,
  UPDATE_ONE_ANNOUNCEMENT, DELETE_ANNOUNCEMENT, SET_CURRENT_ANNOUNCEMENT } from './main-function/announcements';
import {UPDATE_DISCUSSION_AREAS, PUSH_DISCUSSION_AREA_LAST, UPDATE_DISCUSSION_AREA, DELETE_DISCUSSION_AREA} from './main-function/discussion';
import {UPDATE_DISCUSSION_THREADS_STATE, UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES, PUSH_DISCUSSION_THREAD_FIRST,
  UPDATE_DISCUSSION_CURRENT_THREAD_STATE, SET_CURRENT_DISCUSSION_THREAD, SET_TOTAL_DISCUSSION_PAGES, SET_TOTAL_DISCUSSION_THREAD_PAGES, UPDATE_DISCUSSION_THREAD, UPDATE_DISCUSSION_THREAD_REPLY} from './main-function/discussion';
import {SET_USER_INDEX, SET_USER_GROUP_INDEX, SET_USER_BY_SCHOOL_DATA_INDEX} from '~/actions/main-function/user-index';
import { UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS, UPDATE_COURSES_AVALIABLE_FILTERS_EDUCATION_TYPES, UPDATE_COURSES_STATE,
  UPDATE_COURSES_ALL_PROPS, UPDATE_COURSES_ACTIVE_FILTERS } from '~/actions/main-function/courses';
import { UPDATE_GUIDER_FILTERS_LABELS, UPDATE_GUIDER_FILTERS_WORKSPACES, UPDATE_GUIDER_FILTERS_ADD_LABEL, UPDATE_GUIDER_FILTER_LABEL, UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS, DELETE_GUIDER_FILTER_LABEL, DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS } from '~/actions/main-function/guider/guider-filters';
import { UPDATE_GUIDER_STUDENTS_FILTERS, UPDATE_GUIDER_STUDENTS_ALL_PROPS, UPDATE_GUIDER_STUDENTS_STATE, ADD_TO_GUIDER_SELECTED_STUDENTS, REMOVE_FROM_GUIDER_SELECTED_STUDENTS, SET_CURRENT_GUIDER_STUDENT, SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD, SET_CURRENT_GUIDER_STUDENT_PROP, UPDATE_CURRENT_GUIDER_STUDENT_STATE, ADD_GUIDER_LABEL_TO_USER, REMOVE_GUIDER_LABEL_FROM_USER, ADD_FILE_TO_CURRENT_STUDENT, REMOVE_FILE_FROM_CURRENT_STUDENT } from '~/actions/main-function/guider/guider-students';
import { UPDATE_ALL_STUDENT_USERS_DATA, UPDATE_ALL_STUDENT_USERS_DATA_STATUS, UPDATE_TRANSCRIPT_OF_RECORDS_LOCATION, UPDATE_CURRENT_STUDENT_AND_WORKSPACE_RECORDS_STATUS, UPDATE_CURRENT_STUDENT_AND_WORKSPACE_RECORDS } from '~/actions/main-function/records/records';
import { UPDATE_VOPS, UPDATE_VOPS_STATUS } from '~/actions/main-function/vops';
import { UPDATE_HOPS, UPDATE_HOPS_STATUS } from '~/actions/main-function/hops';

interface WEBSOCKET_EVENT extends SpecificActionType<"WEBSOCKET_EVENT", {event: string}> {};

export type ActionType = SET_CURRENT_MESSAGE_THREAD | UPDATE_MESSAGES_STATE |
UPDATE_MESSAGES_ALL_PROPERTIES | UPDATE_MESSAGE_ADD_LABEL | UPDATE_MESSAGE_DROP_LABEL | PUSH_ONE_MESSAGE_FIRST |
LOCK_TOOLBAR | UNLOCK_TOOLBAR | UPDATE_ONE_MESSAGE | DELETE_MESSAGE | UPDATE_MESSAGES_ALL_PROPERTIES | UPDATE_SIGNATURE |
SET_LOCALE | ADD_NOTIFICATION | HIDE_NOTIFICATION | LOGOUT | UPDATE_TITLE | UPDATE_SELECTED_MESSAGES | ADD_TO_COMMUNICATOR_SELECTED_MESSAGES |
REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES | UPDATE_MESSAGE_COUNT | UPDATE_LAST_WORKSPACE | UPDATE_WORKSPACES | UPDATE_MESSAGES |
UPDATE_ANNOUNCEMENTS | UPDATE_COMMUNICATOR_NAVIGATION_LABELS | ADD_COMMUNICATOR_NAVIGATION_LABEL | UPDATE_ONE_LABEL_FROM_ALL_MESSAGES
| UPDATE_COMMUNICATOR_NAVIGATION_LABEL | DELETE_COMMUNICATOR_NAVIGATION_LABEL | REMOVE_ONE_LABEL_FROM_ALL_MESSAGES | WEBSOCKET_EVENT |
UPDATE_ANNOUNCEMENTS_STATE | UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES | UPDATE_SELECTED_ANNOUNCEMENTS | ADD_TO_ANNOUNCEMENTS_SELECTED |
REMOVE_FROM_ANNOUNCEMENTS_SELECTED | UPDATE_ONE_ANNOUNCEMENT | SET_CURRENT_ANNOUNCEMENT | DELETE_ANNOUNCEMENT | UPDATE_DISCUSSION_AREAS |
UPDATE_DISCUSSION_THREADS_STATE | UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES | PUSH_DISCUSSION_AREA_LAST | UPDATE_DISCUSSION_AREA |
DELETE_DISCUSSION_AREA | SET_USER_INDEX | PUSH_DISCUSSION_THREAD_FIRST | UPDATE_DISCUSSION_CURRENT_THREAD_STATE |
SET_CURRENT_DISCUSSION_THREAD | SET_TOTAL_DISCUSSION_PAGES | SET_TOTAL_DISCUSSION_THREAD_PAGES | UPDATE_DISCUSSION_THREAD |
UPDATE_DISCUSSION_THREAD_REPLY | PUSH_MESSAGE_LAST_IN_CURRENT_THREAD | SET_USER_GROUP_INDEX | SET_USER_BY_SCHOOL_DATA_INDEX |
UPDATE_COURSES_AVALIABLE_FILTERS_EDUCATION_TYPES | UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS | UPDATE_COURSES_STATE |
UPDATE_COURSES_ALL_PROPS | UPDATE_COURSES_ACTIVE_FILTERS | UPDATE_GUIDER_FILTERS_LABELS |
UPDATE_GUIDER_FILTERS_WORKSPACES | UPDATE_GUIDER_STUDENTS_FILTERS | UPDATE_GUIDER_STUDENTS_ALL_PROPS | UPDATE_GUIDER_STUDENTS_STATE |
ADD_TO_GUIDER_SELECTED_STUDENTS | REMOVE_FROM_GUIDER_SELECTED_STUDENTS | SET_CURRENT_GUIDER_STUDENT | SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD |
SET_CURRENT_GUIDER_STUDENT_PROP | UPDATE_CURRENT_GUIDER_STUDENT_STATE | ADD_GUIDER_LABEL_TO_USER | REMOVE_GUIDER_LABEL_FROM_USER |
UPDATE_GUIDER_FILTERS_ADD_LABEL | UPDATE_GUIDER_FILTER_LABEL | UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS |
DELETE_GUIDER_FILTER_LABEL | DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS | ADD_FILE_TO_CURRENT_STUDENT | REMOVE_FILE_FROM_CURRENT_STUDENT |
UPDATE_ALL_STUDENT_USERS_DATA | UPDATE_ALL_STUDENT_USERS_DATA_STATUS | UPDATE_TRANSCRIPT_OF_RECORDS_LOCATION |
UPDATE_CURRENT_STUDENT_AND_WORKSPACE_RECORDS_STATUS | UPDATE_CURRENT_STUDENT_AND_WORKSPACE_RECORDS | UPDATE_VOPS | UPDATE_VOPS_STATUS |
UPDATE_HOPS | UPDATE_HOPS_STATUS
export type AnyActionType = ActionType | DeferredAction | AsyncDeferredAction