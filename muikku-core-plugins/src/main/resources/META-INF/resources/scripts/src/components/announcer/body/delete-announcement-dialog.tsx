import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AnyActionType } from '~/actions';
import { i18nType } from '~/reducers/base/i18n';
import Link from '~/components/general/link';
import Dialog from '~/components/general/dialog';
import { deleteSelectedAnnouncements, deleteAnnouncement,
  DeleteSelectedAnnouncementsTriggerType, DeleteAnnouncementTriggerType } from '~/actions/main-function/announcements';
import { AnnouncementType } from 'reducers/main-function/announcements';
import {StateType} from '~/reducers';

interface DeleteAnnouncementDialogProps {
  i18n: i18nType,
  announcement?: AnnouncementType
  children: React.ReactElement<any>,
  deleteSelectedAnnouncements: DeleteSelectedAnnouncementsTriggerType,
  deleteAnnouncement: DeleteAnnouncementTriggerType,
  onDeleteAnnouncementSuccess?: ()=>any
}

interface DeleteAnnouncementDialogState {
  locked: boolean
}

class DeleteAnnouncementDialog extends React.Component<DeleteAnnouncementDialogProps, DeleteAnnouncementDialogState> {
  constructor(props: DeleteAnnouncementDialogProps){
    super(props);
    
    this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
    
    this.state = {
      locked: false
    }
  }
  deleteAnnouncement(closeDialog: ()=>any){
    this.setState({locked: true});
    if (this.props.announcement){
      this.props.deleteAnnouncement({
        announcement: this.props.announcement,
        success: ()=>{
          this.setState({locked: false});
          this.props.onDeleteAnnouncementSuccess && this.props.onDeleteAnnouncementSuccess();
          closeDialog();
        },
        fail: ()=>{
          this.setState({locked: false});
        }
      });
    } else {
      this.props.deleteSelectedAnnouncements();
      this.setState({locked: false});
      closeDialog();
    }
  }
  render(){
    let content = (closeDialog: ()=>any) => <div className="text text--delete-announcement">
      {this.props.announcement ?
       this.props.i18n.text.get('plugin.announcer.deleteDialog.description') :
       this.props.i18n.text.get('plugin.announcer.deleteDialog.description')}
    </div>
       
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="dialog__button-set">
          <Link className="button button--dialog-execute"
          onClick={this.deleteAnnouncement.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.announcer.deleteDialog.deleteButton.label')}
          </Link>
          <Link className="button button--dialog-cancel" onClick={closeDialog}>
            {this.props.i18n.text.get('plugin.announcer.deleteDialog.cancelButton.label')}
          </Link>
        </div>
      )
    }
    
    return <Dialog modifier="delete-announcement"
      title={this.props.i18n.text.get('plugin.announcer.deleteDialog.title')}
      content={content} footer={footer}>
      {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({deleteSelectedAnnouncements, deleteAnnouncement}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteAnnouncementDialog);