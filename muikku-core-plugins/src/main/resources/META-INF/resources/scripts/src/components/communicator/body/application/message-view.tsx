import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import equals = require("deep-equal");

import Link from '~/components/general/link';
import NewMessage from './new-message';
import {CommunicatorThreadType} from '~/reducers/main-function/communicator/communicator-messages';
import {StatusType} from '~/reducers/base/status';
import {i18nType} from '~/reducers/base/i18n';
import TouchPager from '~/components/general/touch-pager';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';

interface MessageViewProps {
  i18n: i18nType,
  communicatorMessagesCurrent: CommunicatorThreadType,
  status: StatusType
}

interface MessageVitewState {
}

class MessageView extends React.Component<MessageViewProps, MessageVitewState> {
  private initialXPos: number;
  private initialYPos: number;
  private closeInterval: NodeJS.Timer;
  
  constructor(props: MessageViewProps){
    super(props);
    
    this.loadMessage = this.loadMessage.bind(this);
  }
  loadMessage(messageId: number){
    if (history.replaceState){
      history.replaceState('', '', location.hash.split("/")[0] + "/" + messageId);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  }
  render(){ 
    if (this.props.communicatorMessagesCurrent === null){
      return null;
    }
    return <TouchPager hasNext={!!this.props.communicatorMessagesCurrent.newerThreadId}
      hasPrev={!!this.props.communicatorMessagesCurrent.olderThreadId}
      goForward={this.loadMessage.bind(this, this.props.communicatorMessagesCurrent.newerThreadId)}
      goBackwards={this.loadMessage.bind(this, this.props.communicatorMessagesCurrent.olderThreadId)}>{
        this.props.communicatorMessagesCurrent.messages.map((message)=>{
          let senderObject = {
            type: "user",
            value: message.sender
          };
          let recipientsObject = message.recipients.map(r=>({
            type: "user",
            value: {
              id: r.userId,
              firstName: r.firstName,
              lastName: r.lastName,
              nickName: r.nickName
            }
          })).filter(user=>user.value.id !== this.props.status.userId);
          let userGroupObject = message.userGroupRecipients.map((ug:any)=>({
            type: "usergroup",
            value: ug
          }));
          let workspaceObject = message.workspaceRecipients.map((w:any)=>({
            type: "usergroup",
            value: w
          }));
          return (
            <div key={message.id} className="application-list__item--communicator-message">            
              <div className="application-list__item-header application-list__item-header--communicator-message">
                <div className="container container--communicator-message-meta">
                  <div className="application-list__item-header-main application-list__item-header-main--communicator-message-participants">
                    <span className="text text--communicator-message-sender">{message.sender.firstName  ? message.sender.firstName +  " " : ""} {message.sender.lastName ? message.sender.lastName : ""}</span>
                    <span className="text text--communicator-message-recipients">
                      {message.recipients.map((recipient) => {
                          return (
                            <span className="text text--communicator-message-recipient" key={recipient.recipientId}>
                              {recipient.firstName ? recipient.firstName + " " : ""} {recipient.lastName ? recipient.lastName + " " : ""}
                            </span>
                          )
                      })}
                    </span>
                  </div>  
                  <div className="application-list__item-header-aside application-list__item-header-aside--communicator-message-time">
                    <span className="text text--communicator-message-created">{this.props.i18n.time.format(message.created)}</span>
                  </div>
                </div>
                <div className="container container--communicator-message-labels">
                  {/* TODO: labels are outside of the message object
                  {message.labels.map((label)=>{
                    return <span className="communicator text communicator-text-tag" key={label.id}>
                      <span className="icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
                      {label.labelName}
                    </span>
                  })} 
                  */}                 
                </div>  
              </div>                  
              <div className="application-list__item-body--communicator-message">
                <header className="text text--communicator-message-caption">{message.caption}</header>
                <section className="text text--communicator-message-content" dangerouslySetInnerHTML={{ __html: message.content}}></section>
              </div>                
              <div className="application-list__item-footer">
                <div className="container container--communicator-message-links">
                  <NewMessage replyThreadId={message.communicatorMessageId} initialSelectedItems={[senderObject]}>
                    <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.communicator.reply')}</Link>
                  </NewMessage>
                  <NewMessage replyThreadId={message.communicatorMessageId}
                     initialSelectedItems={[senderObject].concat(recipientsObject as any).concat(userGroupObject as any).concat(workspaceObject as any)}>
                    <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.communicator.replyAll')}</Link>
                  </NewMessage>    
                </div>  
              </div>                
            </div>
          )
        })}
      </TouchPager>
  }
}

function mapStateToProps(state: any){
  return {
    communicatorMessagesCurrent: state.communicatorMessages.current,
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(MessageView);