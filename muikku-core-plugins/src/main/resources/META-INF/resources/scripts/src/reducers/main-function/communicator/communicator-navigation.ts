import {i18nType} from '~/reducers/i18n';
import {ActionType} from '~/actions';
import {CommunicatorNavigationItemListType, CommunicatorNavigationItemType, CommunicatorNavigationItemUpdateType} from '~/reducers/index.d';

const defaultNavigation: CommunicatorNavigationItemListType = [
  {
    location: "inbox",
    type: "folder",
    id: "inbox",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.inbox")}
  },
  {
    location: "unread",
    type: "folder",
    id: "unread",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.unread")}
  },
  {
    location: "sent",
    type: "folder",
    id: "sent",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.sent")}
  },
  {
    location: "trash",
    type: "folder",
    id: "trash",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.trash")}
  }
]

export default function communicatorNavigation(state:CommunicatorNavigationItemListType=defaultNavigation, action: ActionType): CommunicatorNavigationItemListType {
  if (action.type === 'UPDATE_COMMUNICATOR_NAVIGATION_LABELS'){
    return defaultNavigation.concat(<CommunicatorNavigationItemListType>action.payload);
  } else if (action.type === 'ADD_COMMUNICATOR_NAVIGATION_LABEL'){
    return state.concat(<CommunicatorNavigationItemListType>[<CommunicatorNavigationItemType>action.payload]);
  } else if (action.type === 'DELETE_COMMUNICATOR_NAVIGATION_LABEL'){
    return state.filter((item: CommunicatorNavigationItemType)=>{return item.id !== action.payload.labelId});
  } else if (action.type === 'UPDATE_COMMUNICATOR_NAVIGATION_LABEL'){
    return state.map((item: CommunicatorNavigationItemType)=>{
      if (item.id !== action.payload.labelId){
        return item;
      }
      return Object.assign({}, item, <CommunicatorNavigationItemUpdateType>action.payload.update);
    });
  }
  return state;
}