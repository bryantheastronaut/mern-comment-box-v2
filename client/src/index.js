import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CommentBox from './CommentBox';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<CommentBox />, document.getElementById('root'));
registerServiceWorker();
