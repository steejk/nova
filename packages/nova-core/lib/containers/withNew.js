/*

Generic mutation wrapper to insert a new document in a collection and update
a related query on the client with the new item and a new total item count. 

Sample mutation: 

  mutation moviesNew($document: MoviesInput) {
    moviesNew(document: $document) {
      ...MoviesNewFormFragment
    }
  }

Arguments: 

  - document: the document to insert

Child Props:

  - newMutation(document)
    
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withNew(options) {

  // get options
  const { collection, fragment } = options,
        fragmentName = fragment.definitions[0].name.value,
        collectionName = collection._name,
        mutationName = collection.options.mutations.new.name;

  // wrap component with graphql HoC
  return graphql(gql`
    mutation ${mutationName}($document: ${collectionName}Input) {
      ${mutationName}(document: $document) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    props: ({ownProps, mutate}) => ({
      newMutation: ({document}) => {
        return mutate({ 
          variables: { document },
        });
      }
    }),
  });

}