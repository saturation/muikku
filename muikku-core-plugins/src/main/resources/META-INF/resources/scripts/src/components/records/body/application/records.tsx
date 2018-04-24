import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/course.scss';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/workspace-activity.scss';
import '~/sass/elements/file-uploader.scss';

import { RecordsType, TransferCreditType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { WorkspaceType, WorkspaceStudentAssessmentsType, WorkspaceAssessementState } from '~/reducers/main-function/workspaces';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';

let ProgressBarLine = require('react-progressbar.js').Line;

interface RecordsProps {
  i18n: i18nType,
  records: RecordsType
}

interface RecordsState {
}

let storedCurriculumIndex:any = {};

function getEvaluationRequestIfAvailable(props: RecordsProps, workspace: WorkspaceType){
  let assesmentState:WorkspaceAssessementState;
  let assesmentDate:string;
  if (workspace.studentAssessments && workspace.studentAssessments.assessmentState){
    assesmentState = workspace.studentAssessments.assessmentState;
    assesmentDate = workspace.studentAssessments.assessmentStateDate;
  } else if (workspace.studentActivity && workspace.studentActivity.assessmentState){
    assesmentState = workspace.studentActivity.assessmentState.state;
    assesmentDate = workspace.studentActivity.assessmentState.date;
  }
  
  if (assesmentState === "pending" || assesmentState === "pending_pass" || assesmentState === "pending_fail"){
    return <div className="text text--list-item-type-title">
      <span title={props.i18n.text.get("plugin.records.workspace.pending",props.i18n.time.format(assesmentDate))} className="text text--evaluation-request icon-assessment-pending"></span>
    </div>
  }
  
  return null;
}

function getTransferCreditValue(props: RecordsProps, transferCredit: TransferCreditType){
  let gradeId = [
    transferCredit.gradingScaleIdentifier,
    transferCredit.gradeIdentifier].join('-');
  let grade = props.records.grades[gradeId];
  return <div className="text text--list-item-type-title">
    <span title={props.i18n.text.get("plugin.records.transferCreditsDate", props.i18n.time.format(transferCredit.date))} className={`text text--workspace-credit-grade ${grade.passing ? "state-PASSED" : "state-FAILED"}`}>
      {grade.grade}
    </span>
  </div>
}

function getAssessments(props: RecordsProps, workspace: WorkspaceType){
  let acessment = workspace.studentAssessments.assessments[0];
  if (!acessment){
    return null;
  }
  let gradeId = [
    acessment.gradingScaleSchoolDataSource,
    acessment.gradingScaleIdentifier,
    acessment.gradeSchoolDataSource,
    acessment.gradeIdentifier].join('-');
  let grade = props.records.grades[gradeId];
  return <span className="text text--list-item-type-title">
    <span title={props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(acessment.evaluated))} className={`text text--workspace-assesment-grade ${acessment.passed ? "state-PASSED" : "state-FAILED"}`}>
      {grade.grade}
    </span>
  </span>
}

function getActivity(props: RecordsProps, workspace: WorkspaceType){
    if (!workspace.studentActivity){
      return null;
    } else if ((workspace.studentActivity.exercisesTotal + workspace.studentActivity.evaluablesTotal) === 0){
      return null;
    }
    let evaluablesCompleted = workspace.studentActivity.evaluablesPassed + workspace.studentActivity.evaluablesSubmitted +
      workspace.studentActivity.evaluablesFailed + workspace.studentActivity.evaluablesIncomplete;
    return <div className="workspace-activity workspace-activity--studies">
    
      {workspace.studentActivity.evaluablesTotal ? <ProgressBarLine containerClassName="workspace-activity__progressbar workspace-activity__progressbar--studies" initialAnimate options={{
        strokeWidth: 1,
        duration: 1000,
        color: "#ce01bd",
        trailColor: "#f5f5f5",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "4px"},
        text: {
          className: "text workspace-activity__progressbar-label",
          style: {
            right: workspace.studentActivity.evaluablesDonePercent === 0 ? null : 100 - workspace.studentActivity.evaluablesDonePercent +  "%"
          }
        }
      }}
      strokeWidth={1} easing="easeInOut" duration={1000} color="#ce01bd" trailColor="#f5f5f5"
      trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
      text={evaluablesCompleted + "/" + workspace.studentActivity.evaluablesTotal}
      progress={workspace.studentActivity.evaluablesDonePercent/100}/> : null}
    
      {workspace.studentActivity.exercisesTotal ? <ProgressBarLine containerClassName="workspace-activity__progressbar workspace-activity__progressbar--studies" initialAnimate options={{
        strokeWidth: 1,
        duration: 1000,
        color: "#ff9900",
        trailColor: "#f5f5f5",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "4px"},
        text: {
          className: "text workspace-activity__progressbar-label",
          style: {
            right: workspace.studentActivity.exercisesDonePercent === 0 ? null : 100 - workspace.studentActivity.exercisesDonePercent + "%"
          }
        }
      }}
      strokeWidth={1} easing="easeInOut" duration={1000} color="#ff9900" trailColor="#f5f5f5"
      trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
      text={workspace.studentActivity.exercisesAnswered + "/" + workspace.studentActivity.exercisesTotal}
      progress={workspace.studentActivity.exercisesDonePercent/100}/> : null}
    </div>
}

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps){
    super(props);
    
    this.goToWorkspace = this.goToWorkspace.bind(this);
  }
  
  goToWorkspace(user: UserWithSchoolDataType, workspace: WorkspaceType) {
    window.location.hash = "#?u=" + user.userEntityId + "&w=" + workspace.id;
  }
    
  render(){
    
    if (this.props.records.userDataStatus === "LOADING"){
      return null;
    } else if (this.props.records.userDataStatus === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    }    
    
    if (Object.keys(storedCurriculumIndex).length && this.props.records.curriculums.length){
      this.props.records.curriculums.forEach((curriculum)=>{
        storedCurriculumIndex[curriculum.identifier] = curriculum.name;
      });
    }
    
    let studentBasicInfo = <div className="application-sub-panel__body text">
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.records.studyStartDateLabel")}</div>
        <div className="application-sub-panel__item-data">
          <span className="text text--guider-profile-value">{this.props.records.studyStartDate ? 
            this.props.i18n.time.format(this.props.records.studyStartDate) : "-"}</span>
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.records.studyTimeEndLabel")}</div>
        <div className="application-sub-panel__item-data">
          <span className="text text--guider-profile-value">{this.props.records.studyTimeEnd ? 
            this.props.i18n.time.format(this.props.records.studyTimeEnd) : "-"}</span>
        </div>
      </div>
    </div>  
    
    let studentRecords = <div className="application-sub-panel">
        {this.props.records.userData.map((data)=>{
          let user = data.user;
          let records = data.records;      

          return <div className="react-required-container" key={data.user.id}>
          <div className="application-sub-panel__header text text--studies-header">{user.studyProgrammeName}</div>
          <div className="application-sub-panel__body">
            {records.length ? records.map((record, index)=>{
              return <div className="application-list" key={record.groupCurriculumIdentifier || index}>
                {record.groupCurriculumIdentifier ? <h3>{storedCurriculumIndex[record.groupCurriculumIdentifier]}</h3> : null}  
                  {record.workspaces.map((workspace)=>{
                    return <div className="application-list__item course course--studies" key={workspace.id}>
                      <div className="application-list__item-header" key={workspace.id} onClick={this.goToWorkspace.bind(this, user, workspace)}>
                        <span className="text text--course-icon icon-books"></span>
                        <span className="text text--list-item-title">{workspace.name} {workspace.nameExtension && <span className="text text--list-item-title-extension">({workspace.nameExtension})</span>}</span> 
                        {getEvaluationRequestIfAvailable(this.props, workspace)}
                        {workspace.studentAssessments.assessments.length ? getAssessments(this.props, workspace) : null}
                        {getActivity(this.props, workspace)}
                      </div>
                    </div>
                  })}
                
                {record.transferCredits.length ? 
                  <div className="application-sub-panel__header text text--studies-header">{this.props.i18n.text.get("plugin.records.transferCredits")}</div> : null}
                  <div className="application-sub-panel__body">
                    <div className="application-list">
                    {record.transferCredits.map((credit)=>{
                      return <div className="application-list__item course course--studies" key={credit.date}>
                      <div className="application-list__item-header">
                          <span className="text text--transfer-credit-icon icon-books"></span>  
                          <span className="text text--list-item-title">{credit.courseName}</span>
                          {getTransferCreditValue(this.props, credit)}
                      </div>
                      </div>
                    })}
                    </div>
                  </div>
              </div>
            }) : <h4>{this.props.i18n.text.get("TODO no records")}</h4>}
          </div>
          </div>
        })}
      </div>  

    // Todo fix the first sub-panel border-bottom stuff from guider. It should be removed from title only.
    
    return <BodyScrollKeeper hidden={this.props.records.location !== "RECORDS" || !!this.props.records.current}>
    
    <div className="application-sub-panel">
      {studentBasicInfo}
    </div>
    {studentRecords}    
    
    <div className="application-sub-panel">
      <div className="application-sub-panel__header text text--studies-header">{this.props.i18n.text.get("plugin.records.files.title")}</div>
      <div className="application-sub-panel__body">
      {this.props.records.files.length ?
        <div className="uploaded-files text application-list">
          {this.props.records.files.map((file)=>{
            return <div className="uploaded-files__item application-list__item" key={file.id}>
              <span className="uploaded-files__item-attachment-icon icon-attachment"></span>
              <Link className="uploaded-files__item-title" href={`/rest/records/files/${file.id}/content`} openInNewTab={file.title}>{file.title}</Link>
            </div>
          })}
        </div> :
        <div className="file-uploader__files-container text">{this.props.i18n.text.get("plugin.records.files.empty")}</div>
      }
      </div>
    </div>
    </BodyScrollKeeper>
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
)(Records);
