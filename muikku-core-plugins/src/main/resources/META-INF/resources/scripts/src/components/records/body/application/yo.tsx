import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';
import {i18nType} from '~/reducers/base/i18n';
import { RecordsType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/buttons.scss';


interface YOProps {
  i18n: i18nType,
  records: RecordsType
}

interface YOState {
}

class YO extends React.Component<YOProps,YOState> {
  constructor(props:YOProps){
    super(props);
  }    
  render(){        
    
      if (this.props.records.location !== "yo") {
        return null;        
      } else {

      return (
        <div>
          <h2>OTSOTS 324234</h2>          
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-sub-panel__body--yo-status-incomplete">
              <div className="application-sub-panel__notification-item">
                <div className="application-sub-panel__notification-body application-sub-panel__notification-body--yo-status-incomplete">Ots</div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-sub-panel__body--yo-status-complete">
              <div className="application-sub-panel__notification-item">
                <div className="application-sub-panel__notification-body">Ots</div>
                <div className="application-sub-panel__notification-footer">
                  <Link className="button button--yo-signup">Nackel</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-sub-panel__body--studies-yo-cards">
              <div className="application-sub-panel__item application-sub-panel__item--summarizer">
                <div className="application-sub-panel__item-header">Laatikko OTS</div>
                <div className="application-sub-panel__item-body application-sub-panel__item-body--summarizer">Luatikko sis</div>
              </div>
              <div className="application-sub-panel__item application-sub-panel__item--summarizer">
                <div className="application-sub-panel__item-header">Laatikko OTS</div>
                <div className="application-sub-panel__item-body application-sub-panel__item-body--summarizer">Luatikko sis
                
                </div>
              </div>
            </div>
          </div>                
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-list">
              <div className="application-list__item course">
                <div className="application-list__item-header application-list__item-header--course">
                  <span className="application-list__header-icon icon-books"></span>
                  <span className="application-list__header-primary">Gur- gurzi 4</span>
                  <span className="application-list__header-secondary">Toissijainen</span>
              </div>
              </div>
              <div className="application-list__item course">
                <div className="application-list__item-header  application-list__item-header--course">
                  <span className="application-list__header-icon icon-books"></span>
                  <span className="application-list__header-primary">Gur- gurzi 5</span>
                  <span className="application-list__header-secondary">Toissijainen</span>
                </div>
              </div> 
            </div>
          </div>                                            
        </div>        
        )
      }
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: state.records
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YO);