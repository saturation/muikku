import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { colorIntToHex, getUserImageUrl } from '~/util/modifiers';
import equals = require( "deep-equal" );
import { i18nType } from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/container.scss';
import '~/sass/elements/discussion.scss';
import '~/sass/elements/avatar.scss';

import { DiscussionType, DiscussionThreadType } from '~/reducers/main-function/discussion';
import { UserIndexType, UserType } from '~/reducers/main-function/user-index';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import Pager from '~/components/general/pager';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import { StateType } from '~/reducers';
import OverflowDetector from '~/components/general/overflow-detector';

interface DiscussionThreadsProps {
  discussion: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType
}

interface DiscussionThreadsState {
}

class DiscussionThreads extends React.Component<DiscussionThreadsProps, DiscussionThreadsState> {
  constructor( props: DiscussionThreadsProps ) {
    super( props );

    this.getToThread = this.getToThread.bind( this );
    this.getToPage = this.getToPage.bind( this );
  }
  getToPage( n: number ) {
    window.location.hash = ( this.props.discussion.areaId || 0 ) + "/" + n;
  }
  getToThread( thread: DiscussionThreadType ) {
    if ( this.props.discussion.areaId === thread.forumAreaId ) {
      window.location.hash = thread.forumAreaId + "/" + this.props.discussion.page +
        "/" + thread.id + "/1";
    }
    window.location.hash = thread.forumAreaId + "/1" +
      "/" + thread.id + "/1";
  }
  render() {
    if ( this.props.discussion.state === "LOADING" ) {
      return null;
    } else if ( this.props.discussion.state === "ERROR" ) {
      //TODO: put a translation here t! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if ( this.props.discussion.threads.length === 0 ) {
      return <div className="empty"><span>{this.props.i18n.text.get( "plugin.communicator.empty.topic" )}</span></div>
    }

    return <BodyScrollKeeper hidden={!!this.props.discussion.current}>
      <div className="discussion-threads">{
        this.props.discussion.threads.map( ( thread: DiscussionThreadType, index: number ) => {

          //NOTE That the index might not be ready as they load async, this user might be undefined in the first rendering
          //round so put something as a placeholder in order to be efficient and make short rendering cycles
          let user: UserType = this.props.userIndex.users[thread.creator];

          let userCategory = thread.creator > 10 ? thread.creator % 10 + 1 : thread.creator;
          let avatar;
          if ( !user ) {
            //This is what it shows when the user is not ready
            avatar = <div className="avatar avatar--category-1"></div>;
          } else {
            //This is what it shows when the user is ready
            avatar = <object className="container container--discussion-profile-image"
              data={getUserImageUrl( user )}
              type="image/jpeg">
              <div className={`avatar avatar--category-${userCategory}`}>{user.firstName[0]}</div>
            </object>;
          }

          return (
            <div key={thread.id} className="discussion-thread" onClick={this.getToThread.bind( this, thread )}>
              <div className="discussion-thread__content">
                <div className="discussion-thread__avatar-container">
                  {avatar}
                </div>
                <div className="discussion-thread__main-container">
                  <div className="discussion-thread__header">
                    {thread.locked ?
                      <div className="discussion__icon icon-lock"></div> : null
                    }
                    {thread.sticky ?
                      <div className="discussion__icon icon-pin"></div> : null
                    }
                    <div className={`discussion__category discussion__category--category-${thread.forumAreaId}`}>
                      <span className="text">{thread.title}</span>
                    </div>
                  </div>
                  {thread.sticky ?
                    <div className="discussion-thread__body">
                      <OverflowDetector as="div" classNameWhenOverflown="text--discussion-thread-item-body--overflown"
                        className="text text--discussion-thread-item-body" dangerouslySetInnerHTML={{ __html: thread.message }} />
                    </div> : null
                  }
                  <div className="discussion-thread__footer">
                    <div className="text text--discussion-thread-user">
                      <span>{user && user.firstName + ' ' + user.lastName}, {this.props.i18n.time.format( thread.created )}</span>
                    </div>
                    <div className="text text--discussion-thread-meta">
                      <div className="text text--discussion-thread-meta-counter">
                        <span className="text text--discussion-thread-meta-counter-title">{this.props.i18n.text.get( "plugin.discussion.titleText.replyCount" )} </span>
                        <span className="text text--item-counter">{thread.numReplies}</span>
                      </div>
                      <div className="text text--discussion-thread-meta-latest-reply">
                        <span>{this.props.i18n.text.get( "plugin.discussion.titleText.lastMessage" )} {this.props.i18n.time.format( thread.updated )}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        } )
      }<Pager onClick={this.getToPage} current={this.props.discussion.page} pages={this.props.discussion.totalPages} />
      </div>
    </BodyScrollKeeper>
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    discussion: state.discussion,
    userIndex: state.userIndex
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( DiscussionThreads );
