import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AnyActionType } from '~/actions';
import { i18nType } from '~/reducers/base/i18n';
import { DiscussionThreadType, DiscussionThreadReplyType } from '~/reducers/main-function/discussion/discussion-threads';
import Link from '~/components/general/link';
import Dialog from '~/components/general/dialog';
import {DeleteCurrentDiscussionThreadTriggerType,
  DeleteDiscussionThreadReplyFromCurrentTriggerType,
  deleteCurrentDiscussionThread,
  deleteDiscussionThreadReplyFromCurrent} from '~/actions/main-function/discussion/discussion-threads';

interface DiscussionDeleteThreadComponentProps {
  i18n: i18nType,
  thread: DiscussionThreadType,
  reply?: DiscussionThreadReplyType,
  deleteCurrentDiscussionThread: DeleteCurrentDiscussionThreadTriggerType,
  deleteDiscussionThreadReplyFromCurrent: DeleteDiscussionThreadReplyFromCurrentTriggerType,
  children: React.ReactElement<any>
}

interface DiscussionDeleteThreadComponentState {
  locked: boolean
}

class DiscussionDeleteThreadComponent extends React.Component<DiscussionDeleteThreadComponentProps, DiscussionDeleteThreadComponentState> {
  constructor(props: DiscussionDeleteThreadComponentProps){
    super(props);
    
    this.deleteComponent = this.deleteComponent.bind(this);
    
    this.state = {
      locked: false
    }
  }
  deleteComponent(closeDialog: ()=>any){
    this.setState({locked: true});
    if (!this.props.reply){
      this.props.deleteCurrentDiscussionThread({
        success: ()=>{
          this.setState({locked: false});
          closeDialog();
        },
        fail: ()=>{
          this.setState({locked: false});
        }
      });
    } else {
      this.props.deleteDiscussionThreadReplyFromCurrent({
        reply: this.props.reply,
        success: ()=>{
          this.setState({locked: false});
          closeDialog();
        },
        fail: ()=>{
          this.setState({locked: false});
        }
      });
    }
  }
  render(){
    let content = (closeDialog: ()=>any) => <div className="text text--delete-area">
      {
        this.props.reply ? 
        this.props.i18n.text.get('TODO are you sure you want to delete reply') :
        this.props.i18n.text.get('TODO are you sure you want to delete thread')
      }
    </div>
       
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div>
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog}>
            {this.props.i18n.text.get('TODO cancel delete')}
          </Link>
          <Link className="button button--standard-ok" onClick={this.deleteComponent.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('TODO ok delete')}
          </Link>
        </div>
      )
    }
    
    return <Dialog modifier="delete-area"
      title={
        this.props.reply ? 
        this.props.i18n.text.get('TODO delete reply title') :
        this.props.i18n.text.get('TODO delete thread title')
      }
      content={content} footer={footer}>
      {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    areas: state.areas,
    discussionThreads: state.discussionThreads
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({deleteCurrentDiscussionThread, deleteDiscussionThreadReplyFromCurrent}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionDeleteThreadComponent);