// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const CommentForm = props => (
  <form onSubmit={props.submitComment}>
    <input
      type="text"
      name="author"
      placeholder="Your name…"
      value={props.author}
      onChange={props.handleChangeText}
    />
    <input
      type="text"
      name="comment"
      placeholder="Say something..."
      value={props.comment}
      onChange={props.handleChangeText}
    />
    <input type="submit" value="Post" />
  </form>
);

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  comment: PropTypes.string,
  author: PropTypes.string,
};

CommentForm.defaultProps = {
  comment: '',
  author: '',
};

export default CommentForm;
