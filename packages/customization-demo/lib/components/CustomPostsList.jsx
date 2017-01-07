import { Components, getRawComponent, replaceComponent } from 'meteor/nova:lib';
import React from 'react';
import { withList } from 'meteor/nova:core';
import Posts from 'meteor/nova:posts';
import gql from 'graphql-tag';

const CustomPostsList = getRawComponent('PostsList');

const PostsList = (props) => {

  const {results, terms, loading, count, totalCount, loadMore, showHeader = true} = props;

  if (results && results.length) {

    const hasMore = totalCount > results.length;

    return (
      <div className="posts-list">
        {showHeader ? <Components.PostsListHeader/> : null}
        <div className="posts-list-content">
          {results.map((post, index) => <Components.PostsItem post={post} listIndex={index} key={post._id} />)}
        </div>
        {hasMore ? (loading ? <Components.PostsLoading/> : <Components.PostsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} />) : <Components.PostsNoMore/>}
      </div>
    )
  } else if (loading) {
    return (
      <div className="posts-list">
        {showHeader ? <Components.PostsListHeader /> : null}
        <div className="posts-list-content">
          <Components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="posts-list">
        {showHeader ? <Components.PostsListHeader /> : null}
        <div className="posts-list-content">
          <Components.PostsNoResults/>
        </div>
      </div>
    )
  }

};

PostsList.displayName = CustomPostsList.displayName;

PostsList.propTypes = {
  results: React.PropTypes.array,
  terms: React.PropTypes.object,
  hasMore: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  count: React.PropTypes.number,
  totalCount: React.PropTypes.number,
  loadMore: React.PropTypes.func,
  showHeader: React.PropTypes.bool,
  listIndex: React.PropTypes.number,
};

PostsList.fragment = CustomPostsList.fragment;

replaceComponent('PostsList', PostsList);
