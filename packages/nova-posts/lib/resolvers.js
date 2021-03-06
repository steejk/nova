import { GraphQLSchema } from 'meteor/nova:core';

const speficicResolvers = {
  Post: {
    user(post, args, context) {
      return context.Users.findOne({ _id: post.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
    upvoters(post, args, context) {
      return post.upvoters ? context.Users.find({_id: {$in: post.upvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
    downvoters(post, args, context) {
      return post.downvoters ? context.Users.find({_id: {$in: post.downvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
  },
};

GraphQLSchema.addResolvers(speficicResolvers);

const resolvers = {

  list: {

    name: 'postsList',

    resolver(root, {terms, offset, limit}, context, info) {
      let {selector, options} = context.Posts.getParameters(terms);
      options.limit = (limit < 1 || limit > 100) ? 100 : limit;
      options.skip = offset;
      // keep only fields that should be viewable by current user
      options.fields = context.getViewableFields(context.currentUser, context.Posts);
      return context.Posts.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'postsSingle',

    resolver(root, {documentId}, context) {
      return context.Posts.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Posts) });
    },
  
  },

  total: {
    
    name: 'postsTotal',
    
    resolver(root, {terms}, context) {
      const {selector} = context.Posts.getParameters(terms);
      return context.Posts.find(selector).count();
    },
  
  }
};

export default resolvers;