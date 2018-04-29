// Comment.js
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Comment = props => (
  <div>
    <h3>{props.author}</h3>
    <ReactMarkdown source={props.children} />
  </div>
);

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default Comment;
