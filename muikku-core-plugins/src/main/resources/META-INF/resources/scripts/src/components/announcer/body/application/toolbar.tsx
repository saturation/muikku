import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import { AnnouncementsType, AnnouncementType } from '~/reducers/main-function/announcements';

import DeleteAnnouncementDialog from '../delete-announcement-dialog';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain, ApplicationPanelToolbarActionsAside } from '~/components/general/application-panel';
import { ButtonPill } from '~/components/general/button';

interface AnnouncerToolbarProps {
  i18n: i18nType,
  announcements: AnnouncementsType
}

interface AnnouncerToolbarState {

}

class AnnouncerToolbar extends React.Component<AnnouncerToolbarProps, AnnouncerToolbarState> {
  constructor( props: AnnouncerToolbarProps ) {
    super( props );

    this.go = this.go.bind( this );
    this.onGoBackClick = this.onGoBackClick.bind( this );
  }
  go( announcement: AnnouncementType ) {
    if ( !announcement ) {
      return;
    }

    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if ( history.replaceState ) {
      history.replaceState( '', '', location.hash.split( "/" )[0] + "/" + announcement.id );
      window.dispatchEvent( new HashChangeEvent( "hashchange" ) );
    } else {
      location.hash = location.hash.split( "/" )[0] + "/" + announcement.id;
    }
  }
  onGoBackClick() {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if ( history.replaceState ) {
      let canGoBack = ( document.referrer.indexOf( window.location.host ) !== -1 ) && ( history.length );
      if ( canGoBack ) {
        history.back();
      } else {
        history.replaceState( '', '', location.hash.split( "/" )[0] );
        window.dispatchEvent( new HashChangeEvent( "hashchange" ) );
      }
    } else {
      location.hash = location.hash.split( "/" )[0];
    }
  }
  render() {
    if ( this.props.announcements.current ) {

      //TODO this should be done more efficiently but the information is not included in the announcement
      //this is why we had to have notOverrideCurrent in the reducers, it's such a mess
      let currentIndex: number = this.props.announcements.announcements.findIndex( ( a: AnnouncementType ) => a.id === this.props.announcements.current.id );
      let next: AnnouncementType = null;
      let prev: AnnouncementType = null;

      if ( currentIndex !== -1 ) {
        next = this.props.announcements.announcements[currentIndex + 1];
        prev = this.props.announcements.announcements[currentIndex - 1];
      }

      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <ButtonPill buttonModifiers="go-back" icon="goback" onClick={this.onGoBackClick} />

            <div className="text text--main-function-current-folder">

            </div>

            <DeleteAnnouncementDialog announcement={this.props.announcements.current} onDeleteAnnouncementSuccess={this.onGoBackClick}>
              <ButtonPill buttonModifiers="delete" icon="delete" />
            </DeleteAnnouncementDialog>
          </ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolbarActionsAside>
            <ButtonPill buttonModifiers="prev-page" disabled={!prev} onClick={this.go.bind( this, prev )} icon="arrow-left" />
            <ButtonPill buttonModifiers="next-page" disabled={!next} onClick={this.go.bind( this, next )} icon="arrow-right" />
          </ApplicationPanelToolbarActionsAside>

        </ApplicationPanelToolbar>
      )
    } else {
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <div className="text text--main-function-current-folder">
              {this.props.i18n.text.get( "plugin.announcer.cat." + this.props.announcements.location )}
            </div>
            <DeleteAnnouncementDialog>
              <ButtonPill buttonModifiers="delete" disabled={this.props.announcements.selected.length === 0} icon="delete"/>
            </DeleteAnnouncementDialog>
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      )
    }
  }
}

//TODO this is another one that uses the different version of announcements
function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( AnnouncerToolbar );