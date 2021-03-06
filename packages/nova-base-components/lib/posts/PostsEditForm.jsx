import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import SmartForm from "meteor/nova:forms";
import Posts from "meteor/nova:posts";
import { withRouter } from 'react-router'
import { ShowIf, withMessages } from 'meteor/nova:core';

class PostsEditForm extends Component {

  renderAdminArea() {
    return (
      <ShowIf check={Posts.options.mutations.edit.check} document={this.props.post}>
        <div className="posts-edit-form-admin">
          <div className="posts-edit-form-id">ID: {this.props.post._id}</div>
          <Components.PostsStats post={this.props.post} />
        </div>
      </ShowIf>
    )
  }

  render() {

    return (
      <div className="posts-edit-form">
        {this.renderAdminArea()}
        <SmartForm
          collection={Posts}
          documentId={this.props.post._id}
          extraFragment={`
            htmlBody
            postedAt
            user{
              _id
              __displayName
              __emailHash
              __slug
            }
          `}
          successCallback={post => {
            this.props.flash(this.context.intl.formatMessage({id: "posts.edit_success"}, {title: post.title}), 'success');
          }}
          removeSuccessCallback={({documentId, documentTitle}) => {
            // post edit form is being included from a single post, redirect to index
            // note: this.props.params is in the worst case an empty obj (from react-router)
            if (this.props.params._id) {
              this.props.router.push('/');
            }

            const deleteDocumentSuccess = this.context.intl.formatMessage({id: 'posts.delete_success'}, {title: documentTitle});
            this.props.flash(deleteDocumentSuccess, "success");
            // todo: handle events in collection callbacks
            // this.context.events.track("post deleted", {_id: documentId});
          }}
          showRemove={true}
        />
      </div>
    );

  }
}

PostsEditForm.propTypes = {
  flash: React.PropTypes.func,
  post: React.PropTypes.object.isRequired,
}

PostsEditForm.contextTypes = {
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  closeCallback: React.PropTypes.func,
  intl: intlShape
}

registerComponent('PostsEditForm', PostsEditForm, withMessages, withRouter);
