import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/jumbo-dialog';
import { UserRecepientType, UserGroupRecepientType } from '~/reducers/main-function/user-index';
import { i18nType } from 'reducers/base/i18n';
import { AnnouncementType } from '~/reducers/main-function/announcer/announcements';
import { AnyActionType } from '~/actions';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';

const ckEditorConfig = {
  uploadUrl: '/communicatorAttachmentUploadServlet',
  toolbar: [
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
    { name: 'links', items: [ 'Link' ] },
    { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'styles', items: [ 'Format' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'tools', items: [ 'Maximize' ] }
  ],
  draftKey: 'announcer-new-announcement',
  resize_enabled: false
}
const extraPlugins = {
  'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.9/',
  'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.9/',
  'filetools' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/4.5.9/',
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'notificationaggregator' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js',
  'uploadwidget' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/4.5.9/',
  'uploadimage' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/4.5.9/'
}

type TargetItemsListType = Array<UserRecepientType | UserGroupRecepientType>;

interface NewAnnouncementProps {
  children: React.ReactElement<any>,
  target: TargetItemsListType,
  i18n: i18nType,
  announcement?: AnnouncementType
}

interface NewAnnouncementState {
  text: string,
  currentTarget: TargetItemsListType,
  subject: string,
  locked: boolean,
  startDate: any,
  endDate: any
}

class NewAnnouncement extends React.Component<NewAnnouncementProps, NewAnnouncementState> {
  constructor(props: NewAnnouncementProps){
    super(props);
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setTargetItems = this.setTargetItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    
    this.state = {
      text: props.announcement ? props.announcement.content : "",
      currentTarget: props.target || [],
      subject: props.announcement ? props.announcement.caption : "",
      locked: false,
      startDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.startDate) : props.i18n.time.getLocalizedMoment(),
      endDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.endDate) : props.i18n.time.getLocalizedMoment().add(1, "day"),
    }
  }
  componentWillReceiveProps(nextProps: NewAnnouncementProps){
    if ((this.props.announcement && nextProps.announcement && nextProps.announcement.id !== this.props.announcement.id) ||
        (!this.props.announcement && nextProps.announcement)){
      this.setState({
        subject: nextProps.announcement.caption,
        text: nextProps.announcement.content,
      });
    } else if (this.props.announcement && !nextProps.announcement){
      this.setState({
        subject: "",
        text: "",
      });
    }
  }
  onCKEditorChange(text: string){
    this.setState({text});
  }
  setTargetItems(currentTarget: TargetItemsListType){
    this.setState({currentTarget});
  }
  onSubjectChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({subject: e.target.value});
  }
  createOrModifyAnnouncement(closeDialog: ()=>any){
    closeDialog();
  }
  handleDateChange(stateLocation: string, newDate: any){
    let nState:any = {};
    nState[stateLocation] = newDate;
    (this.setState as any)(stateLocation)
  }
  render(){
    let content = (closeDialog: ()=>any) => [
      //FOR DESIGN CHECK https://github.com/Hacker0x01/react-datepicker
      (<div key="1">
         <DatePicker selected={this.state.startDate} onChange={this.handleDateChange.bind(this, "startDate")}
           locale={this.props.i18n.time.getLocale()}/>
         <DatePicker selected={this.state.endDate} onChange={this.handleDateChange.bind(this, "endDate")}
           locale={this.props.i18n.time.getLocale()}/>
      </div>),
      (<InputContactsAutofill modifier="new-announcement" key="2" hasUserMessagingPermission={false} placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
        selectedItems={this.state.currentTarget} onChange={this.setTargetItems} autofocus={!this.props.target}></InputContactsAutofill>),
      (<input key="3" type="text" className="form-field form-field--new-announcement-subject"
        placeholder={this.props.i18n.text.get('TODO create message title')}
        value={this.state.subject} onChange={this.onSubjectChange} autoFocus={!!this.props.target}/>),
      (<CKEditor key="4" width="100%" height="grow" configuration={ckEditorConfig} extraPlugins={extraPlugins}
       onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>)
    ]
       
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="jumbo-dialog__button-container">
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('TODO announcer cancel')}
          </Link>
          <Link className="button button--standard-ok" onClick={this.createOrModifyAnnouncement.bind(this, closeDialog)}>
            {this.props.i18n.text.get('TODO announcer okay')}
          </Link>
        </div>
      )
    }
    
    return <JumboDialog modifier="new-announcement"
      title={this.props.i18n.text.get('TODO announcement new create')}
      content={content} footer={footer}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(NewAnnouncement);