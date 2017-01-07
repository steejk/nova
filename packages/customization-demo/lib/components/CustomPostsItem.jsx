import { Components, getRawComponent, replaceComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import Posts from "meteor/nova:posts";
import gql from 'graphql-tag';

class CustomPostsItem extends getRawComponent('PostsItem') {

  render() {

    const post = this.props.post;
    const listIndex = this.props.listIndex + 1; //Index

    let postClass = "posts-item";
    if (post.sticky) postClass += " posts-sticky";

    // ⭐ custom code starts here ⭐
    if (post.color) {
      postClass += " post-"+post.color;
    }

    if (post.url != null){
      var postUrl = '('+post.url+')';
    }
    // ⭐ custom code ends here ⭐

    return (
      <div className={postClass}>

        <div className="post-item-count">
          {listIndex}.
        </div>

        <div className="posts-item-vote">
          <Components.Vote post={post} />
        </div>

        <div className="posts-item-content">

          <h3 className="posts-item-title">
            <Link to={Posts.getLink(post)} className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
              {post.title}
            </Link>
            <Link to={post.url} className="posts-item-title-url">
              {postUrl}
            </Link>
            {this.renderCategories()}
          </h3>

          <div className="posts-item-meta">
            {post.user? <div className="posts-item-user"><Components.UsersName user={post.user}/></div> : null}
            <div className="posts-item-date"><FormattedRelative value={post.postedAt}/></div>
            <div className="posts-item-comments">
              <Link to={Posts.getPageUrl(post)}>
                <FormattedMessage id="comments.count" values={{count: post.commentCount}}/>
              </Link>
            </div>
             {this.props.currentUser && this.props.currentUser.isAdmin ? <Components.PostsStats post={post} /> : null}
            {this.renderActions()}
          </div>

        </div>

      </div>
    )
  }
}

CustomPostsItem.propTypes = {
  currentUser: React.PropTypes.object,
  post: React.PropTypes.object.isRequired,
  listIndex: React.PropTypes.number,
};

CustomPostsItem.fragment = gql`
  fragment PostsItemFragment on Post {
    _id
    title
    url
    slug
    thumbnailUrl
    baseScore
    postedAt
    sticky
    status
    categories {
      # ...minimumCategoryInfo
      _id
      name
      slug
    }
    commentCount
    commenters {
      # ...avatarUserInfo
      _id
      __displayName
      __emailHash
      __slug
    }
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    score # should be asked only for admins?
    viewCount # should be asked only for admins?
    clickCount # should be asked only for admins?
    user {
      # ...avatarUserInfo
      _id
      __displayName
      __emailHash
      __slug
    }
    color
  }
`;

replaceComponent('PostsItem', CustomPostsItem);
