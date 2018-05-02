// Comment.js
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Comment = props => (
  <div>
    <h3>{props.author}</h3>
    <ReactMarkdown source={props.children} />
    <a onClick={() => { props.handleUpdateComment(props.id); }}>update</a>
    <a onClick={() => { props.handleDeleteComment(props.id); }}>delete</a>
  </div>
);

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
};

export default Comment;
