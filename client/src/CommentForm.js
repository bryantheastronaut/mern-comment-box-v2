// CommentForm.js
import React, { Component } from 'react';

class CommentForm extends Component {
  constructor() {
    super();
    this.state = { author: '', text: '' };
  }

  handleAuthorChange = e => this.setState({author: e.target.value });

  handleTextChange = e => this.setState({ text: e.target.value });

  handleSubmit(e) {
    e.preventDefault();
    console.log(`${this.state.author} said “${this.state.text}”`);
    // we will be tying this into the POST method in a bit
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name…"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
}

export default CommentForm;
