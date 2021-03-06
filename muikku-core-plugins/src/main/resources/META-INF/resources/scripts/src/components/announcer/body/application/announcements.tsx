import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");
import {StateType} from '~/reducers';

import NewEditAnnouncement from '../../dialogs/new-edit-announcement';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/announcement.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/label.scss';

import { AnnouncementsType, AnnouncementType } from '~/reducers/main-function/announcements';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';
import Link from '~/components/general/link';
import { AddToAnnouncementsSelectedTriggerType, RemoveFromAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected, addToAnnouncementsSelected } from '~/actions/main-function/announcements';
import DeleteAnnouncementDialog from '../../dialogs/delete-announcement';
import ApplicationList, { ApplicationListItem, ApplicationListItemContentWrapper, ApplicationListItemFooter, ApplicationListItemBody, ApplicationListItemHeader } from '~/components/general/application-list';

interface AnnouncementsProps {
  i18n: i18nType,
  announcements: AnnouncementsType,
  addToAnnouncementsSelected: AddToAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType
}

interface AnnouncementsState {
}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {
  setCurrentAnnouncement(announcement: AnnouncementType){
    window.location.hash = window.location.hash.split("/")[0] + "/" + announcement.id;
  }
  render(){
    if (this.props.announcements.state === "LOADING"){
      return null;
    }
    return (<BodyScrollKeeper hidden={!!this.props.announcements.current}>
        <SelectableList as={ApplicationList} selectModeModifiers="select-mode" dataState={this.props.announcements.state}>
          {this.props.announcements.announcements.map((announcement: AnnouncementType)=>{
            let className = announcement.workspaces.length ? 
                'announcement announcement--workspace' :
                'announcement announcement--environment';
            return {
              as: ApplicationListItem,
              className,
              onSelect: this.props.addToAnnouncementsSelected.bind(null, announcement),
              onDeselect: this.props.removeFromAnnouncementsSelected.bind(null, announcement),
              onEnter: this.setCurrentAnnouncement.bind(this, announcement),
              isSelected: this.props.announcements.selectedIds.includes(announcement.id),
              key: announcement.id,
              contents: (checkbox: React.ReactElement<any>)=>{
                return <ApplicationListItemContentWrapper className="announcement__content" aside={<div className="announcement__select-container">
                  {checkbox}
                </div>}>
                  <ApplicationListItemHeader>
                    <div className="application-list__header-primary">
                      <span className="glyph icon-clock"></span>
                      <span className="application-list__header-item-dates">
                        {this.props.i18n.time.format(announcement.startDate)} - {this.props.i18n.time.format(announcement.endDate)}
                      </span>
                    </div> 
                  </ApplicationListItemHeader>                  
                  <ApplicationListItemBody>
                    <article className="application-list-document-short">
                      <header className="application-list-document-short-header">{announcement.caption}</header>
                      {/*<p className="rich-text" dangerouslySetInnerHTML={{__html:announcement.content}}></p>*/}
                    </article>
                  </ApplicationListItemBody>
                  {announcement.workspaces && announcement.workspaces.length ? 
                    <div className="labels item-list__announcement-workspaces">
                    {announcement.workspaces.map((workspace)=>{ 
                      return <span className="label" key={workspace.id}>
                        <span className="label__icon label__icon--announcement-workspace icon-books"></span>
                        <span className="label__text label__text--announcement-workspace">{workspace.name} {workspace.nameExtension ? "(" + workspace.nameExtension + ")" : null }</span>
                      </span>
                    })}
                    </div> : null}
                  <ApplicationListItemFooter modifiers="announcement-actions">  
                    <NewEditAnnouncement announcement={announcement}>
                      <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.announcer.link.edit')}</Link>
                    </NewEditAnnouncement>
                    {this.props.announcements.location !== "archived" ? <DeleteAnnouncementDialog announcement={announcement}>
                      <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.announcer.link.delete')}</Link>
                    </DeleteAnnouncementDialog> : null}
                  </ApplicationListItemFooter>
                </ApplicationListItemContentWrapper>
             }
            }
          })}
        </SelectableList>
    </BodyScrollKeeper>);
  }
}

//TODO yet another one with the different version
function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({
    addToAnnouncementsSelected,
    removeFromAnnouncementsSelected
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Announcements);
