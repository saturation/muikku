import MainFunctionNavbar from '../base/main-function/navbar';
import ScreenContainer from '../general/screen-container';

import AnnouncementsPanel from './body/announcements-panel';
import ContinueStudiesPanel from './body/continue-studies-panel';
import ImportantPanel from './body/important-panel';
import LastMessagesPanel from './body/latest-messages-panel';
import WorkspacesPanel from './body/workspaces-panel';

import * as React from 'react';

import '~/sass/elements/container.scss';
import '~/sass/elements/ordered-container.scss';

//TODO css get rid of ordered container 
export default class IndexBody extends React.Component<{},{}> {
  render(){
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="index"/>
      <ScreenContainer>
        <div className="ordered-container ordered-container--index-panels">
          <div className="ordered-container__item ordered-container__item--studies">
            <div className="ordered-container">
              <ContinueStudiesPanel/>
              <WorkspacesPanel/>
            </div>
          </div>
          <div className="ordered-container__item ordered-container__item--messages">
            <div className="ordered-container">
              <LastMessagesPanel/>
            </div>
          </div>
          <div className="ordered-container__item ordered-container__item--announcements">
            <div className="ordered-container">
              <ImportantPanel/>
              <AnnouncementsPanel/>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </div>);
  }
}