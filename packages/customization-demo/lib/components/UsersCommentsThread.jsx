import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ModalTrigger, withList, withCurrentUser, Components, registerComponent, Utils } from 'meteor/nova:core';
import Comments from 'meteor/nova:comments';
import gql from 'graphql-tag';

const UsersCommentsThread = (props, context) => {

  const {loading, terms: { userId }, results, count} = props;

  if (loading) {

    return <div className="users-comments-thread"><Components.Loading/></div>

  } else {

    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, '_id', 'parentCommentId');

    console.log(props)

    return (
      <div className="users-comments-thread">
        <h4 className="users-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>
        <Components.CommentsList comments={nestedComments} commentCount={count}/>
        {!!props.currentUser ?
          <div className="users-comments-thread-new">
            <h4><FormattedMessage id="comments.new"/></h4>
          </div> :
          <div>
            <ModalTrigger size="small" component={<a><FormattedMessage id="comments.please_log_in"/></a>}>
              <Components.UsersAccountForm/>
            </ModalTrigger>
          </div>
        }
      </div>
    );
  }
};

UsersCommentsThread.displayName = "UsersCommentsThread";

UsersCommentsThread.propTypes = {
  currentUser: React.PropTypes.object
};

UsersCommentsThread.fragment = gql`
  fragment commentsListFragment on Comment {
    _id
    postId
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    postedAt
    user {
      _id
      __displayName
      __emailHash
      __slug
    }
    userId
  }
`;

const options = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragment: UsersCommentsThread.fragment,
};

registerComponent('UsersCommentsThread', UsersCommentsThread, withList(options), withCurrentUser);
