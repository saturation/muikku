import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {WorkspaceListType, WorkspaceType} from '~/reducers/workspaces';
import {StateType} from '~/reducers';
import Panel from '~/components/general/panel';

interface LastMessagesPanelProps {
  i18n: i18nType,
  workspaces: WorkspaceListType
}

interface LastMessagesPanelState {
  
}

class WorkspacesPanel extends React.Component<LastMessagesPanelProps, LastMessagesPanelState> {
  render(){
    return (<div className="ordered-container__item ordered-container__item--index-panel-container ordered-container__item--workspaces">   
      <div className="ordered-container__item-header">
        <span className="ordered-container__item-header-icon ordered-container__item-header-icon--workspaces icon-books"></span>
        <span className="ordered-container__item-header-text">{this.props.i18n.text.get('plugin.frontPage.workspaces.title')}</span>
      </div>
      <Panel modifier="index">        
        {this.props.workspaces.length ? (
          <div className="item-list item-list--panel-workspaces">
            {this.props.workspaces.map((workspace: WorkspaceType)=>{
              return <Link key={workspace.id} className="item-list__item item-list__item--workspaces" href={`/workspace/${workspace.urlName}`}>
                <span className="item-list__icon item-list__icon--workspaces icon-books"></span>
                <span className="item-list__text-body">
                  {`${workspace.name} ${workspace.nameExtension ? "(" + workspace.nameExtension + ")" : ""}`}
                </span>
              </Link>              
            })}
          </div>
        ) : (
          <div className="panel__empty">
            {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part1')}
            <Link href="/coursepicker">
              {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.coursepicker')}
            </Link>
            {" "}{this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part2')}
          </div>
        )}
       </Panel>
     </div>);      
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspaces: state.workspaces.workspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspacesPanel);