/* 

A component to configure the "edit movie" form.
Wrapped with the "withDocument" container.

*/

import React, { PropTypes, Component } from 'react';
import SmartForm from "meteor/nova:forms";
import Movies from '../collection.js';

const MoviesEditForm = (props, context) => {
  return (
    <SmartForm 
      collection={Movies} 
      documentId={props.documentId}
      showRemove={true}
    />
  )
}

MoviesEditForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}

export default MoviesEditForm;