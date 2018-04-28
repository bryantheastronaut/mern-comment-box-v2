// Comment.js
import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

const Comment = (props) => {
  const rawMarkup = marked(props.children.toString());
  return (
    <div>
      <h3>{props.author}</h3>
      {rawMarkup}
    </div>
  );
};

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default Comment;
