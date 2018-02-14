import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");
import {i18nType} from '~/reducers/base/i18n';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/announcement.scss';
import { AnnouncementListType, AnnouncementType } from '~/reducers/main-function/announcer/announcements';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';
import Link from '~/components/general/link';


interface AnnouncementProps {
  i18n: i18nType,
  announcement: AnnouncementType,
}

interface AnnouncementState {
}

class Announcement extends React.Component<AnnouncementProps, AnnouncementState> {
  render(){    
    if (!this.props.announcement) {
      return (null)      
    }        
    return (
      <div className="application-list application-list--open">
        <div className={`application-list__item ${this.props.announcement.workspaces.length ? "application-list__item--workspace-announcement" : "application-list__item--environment-announcement"}`}>

          <div className="application-list__item-body">
            <header className="text text--announcer-announcement-caption">{this.props.announcement.caption}</header>
            <div className="container container--announcer-announcement-date">
              <span className="text__icon icon-clock"></span>
              <span className="text text--announcements-times">
                {this.props.i18n.time.format(this.props.announcement.startDate)} - {this.props.i18n.time.format(this.props.announcement.endDate)}
              </span>
            </div>
            
            <section className="text text--announcer-announcement-content" dangerouslySetInnerHTML={{__html: this.props.announcement.content}}></section>                                
          </div>  
                
         ${this.props.announcement.workspaces.length ?      
          <div className="application-list__item-meta">
            <div className="text text--announcer-announcement-workspaces">
              <div className="text text--announcer-workspace"> 
                <span className="text__icon text__icon--anouncement-workspace icon-books"></span>
             {/* This needs mapping of workspaces
                <span className="text text--announcement-workspace-name">{this.props.workspaces}</span>
             */}
              </div>
            </div>
          </div>     
          : null}
        </div>                 
      </div>      
    );
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    announcement: state.currentAnnouncement
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({

  }, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Announcement);
