Ok, here we go! This is a _(much needed)_ update to me original MERN Facebook Comment box tutorial. That can be found [here](www.example.com), but this is the new and improved version. I've 1) learned A TON since that last tutorial and, 2) the community has come to some best practices that we will implement here. The premise will be the same -- we will be building a Facebook-like comment box.

As before -- this tutorial expects a basic understanding of React -- this is a MERN tutorial, not a React tutorial. If you are not comfortable with React, I would highly recommend [their excellent docs](www.example.com)

Anyways, lets get started.

TODO: PUT SOMETHING ABOUT INSTALLING GIT IF THEY DONT HAVE IT

## Some Changes
I will be using Yarn instead of NPM for this project. You can feel free to use whichever you prefer. if you want to use npm, note that `yarn add` would become `npm i[nstall]`. In most other cases, you can just replace `yarn` with `npm` and will be fine. If you want to give yarn a try, you can [find it here](https://yarnpkg.com/lang/en/docs/install/#mac-stable).

## Initial folder structure

First things first, we need to make a place for all our code to live. To create a new folder and move us into it, lets enter into the terminal:
`$ mkdir mern-comment-box && cd mern-comment-box`

We will be using the npm package `create-react-app` for our base React code. This is an AMAZING package to get started, so if you dont have it, run:
`$ npm i -g create-react-app`

Now, we can run `$ create-react-app client`
to bootstrap our react front end! Neat!

Our project structure is going to look something like this:
```
mern-comment-box
  - client/
  - backend/
    - models/
      - comments.js
    - server.js
  - node_modules/
  - package.json
  - .gitignore
```

Since create-react-app has set our whole client folder up for us already, lets start on the backend.

```
$ mkdir backend && mkdir backend/models && touch backend/models/comment.js && touch backend/server.js
```

Before we go any further, we should run `$ yarn init` to create our package.json folder and be ready to start imports. We will also be using github to track our progress because it is good practice, so you should start doing it (it only takes losing good progress once to realize its true value)

so we can run `$ git init` to create our git repository.

Now, lets create a file which will tell git which files to ignore (our node_modules/ specifically).

`$ touch .gitignore` will create this file. Open it up and enter:
```
.gitignore
node_modules/
```
this tells git to ignore: 1) this file, and 2) all node_modules/ folders

Now, lets commit our progress. We should be doing this periodically. We can do this easily by:
```
git add .
git commit -m 'Initializing repository [or whatever you are doing in this set of work]
```

### Side note on git:
Lets see the importance of using git tracking really quickly.

Now that we have a repository with commits in it, if we do something wild like say...
```
$ rm -rf backend
```
Oh shoot! We accidentaly just deleted all our work! (even though its just an empty folder). If you've ever felt this pain or panic before, lets let our savior `git` come and rescue us from this hellscape.

Lets do some exploring:

`$ ls` confirms our worst fears, we accidently removed our _ENTIRE_ backend!

If we run `$ git log --oneline`, we can see our commit history. Mine looks like this (yours may be different)
```
de6a88a (HEAD -> master) Initializing repository
```

If we run `git reset --hard` we will reset all our changes to our last commit (which is called HEAD), `git`ing all our work back :)

**Note: the `--hard` flag will throw away all your uncommited changes

What if we accidentaly commited the removal of our backend?

```
$ rm -rf backend && git add . && git commit -m 'removing backend for git example'
```

`$ git log --oneline` shows us where our HEAD is (our last commit), as well as our first commit:
```
da36490 (HEAD -> master) removing backend for git example
de6a88a Initializing repository
```

Now running `$ git reset --hard` doesnt help us. It still brings us to where we removed our backend folder.

Thankfully, we can use `$ git reset --hard HEAD~1` (HEAD - 1) or the commit hash `$ git reset --hard de6a88a` to get our work back.

So with this knowledge, use git tracking to save meaningful changes. To learn more about the power of `git`, give [this great lesson try](https://try.github.io/levels/1/challenges/1)

## Back from the git sidequest

Okay! We're now in a good place to start! We're going to be doing a bunch of work in the backend first, so setting up our server.js file, we can run `$ yarn add express body-parser nodemon morgan mongoose concurrently babel-cli babel-preset-es2015 babel-preset-stage-0` to get our dependencies in order.

- Express: is what we will be using as our server framework (The E in M __E__ RN)
- Body parser: a package which helps us get the body off of network requests
- Nodemon: a package that watches our server for changes, and restarts it (for a better dev experience)
- Morgan: a logging package to make it easier to debug our network requests to this api
- Mongoose: a package that lets us interact with MongoDB in an easier way (the M in __M__ ERN)

## Getting our components set up

TODO: EXPLAIN LINTING SETUP
eslintrc.json get deps

Lets do some clean-up in our client folder. First, we can `$ cd client` for easier terminal access to files and folders we are currently using. (Protip: hitting tab as you are typing folders/files in the terminal will auto-complete for you if it can figure it out) We can `$ rm src/logo.svg src/App.css src/App.test.js src/App.js`, as we dont need these. Now, lets make all the components we need. In a larger app, i would break these out into _Container_ and _Component_ folders, but since we are only dealing with a few files, we can keep them all under _src/_. Lets `$ cd src && touch CommentList.js CommentBox.js CommentForm.js Comment.js data.js` to make all the files we need. The data file will contain hardcoded data for intial testing, but by the end we will remove it, as all our data will live in our database.

In _index.js_, we need to make some changes so it points to CommentBox instead of App, so change your file to use CommentBox instead of App:

```
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CommentBox from './CommentBox';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<CommentBox />, document.getElementById('root'));
registerServiceWorker();

```

We need the `marked` package to convert markdown to text, and we need something to fetch data from the browser. For this, we will use the `whatwg-fetch` package, which is a polyfill for the window.fetch object. so we can `$ yarn add marked whatwg-fetch`.

We will also be using eslint to catch errors some easy problems, and defining our prop types to ensure the data we are getting is what we expect.

`$ yarn add --dev prop-types eslint babel-eslint` will get us the prop types, eslint, and eslint babel parser package. I use the airbnb eslint rules, and we can go to [the npmjs page](https://www.npmjs.com/package/eslint-config-airbnb) and see a command to get it with all its depedencies. Since we are using yarn instead of npm, we will modify it slighly, replacing the `npm install --save-dev` with `yarn add --dev`, like so:

```
(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev "$PKG@latest"
)
```

These are how the files will statically look, and going forward we will replace the hardcoded values with dynamically generated things fromthe server.

```
// CommentBox.js
import React, { Component } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import DATA from './data';

export default class CommentBox extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }
  render() {
    return (
      <div>
        <h2>Comments:</h2>
        <CommentList data={DATA} />
        <CommentForm />
      </div>
    );
  }
}

```

```
// CommentList.js
import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

const CommentList = (props) => {
  const commentNodes = props.data.map(comment => (
    <Comment author={comment.author} key={comment.id}>
      { comment.text}
    </Comment>
  ));
  return (
    <div>
      { commentNodes }
    </div>
  );
};

CommentList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    author: PropTypes.string,
    id: PropTypes.string,
    text: PropTypes.string,
  })),
};

CommentList.defaultProps = {
  data: [],
};

export default CommentList;

```

```
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

```

```
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

```

```
// data.js
const data = [
  { id: 1, author: 'Bryan', text: 'Wow this is neat' },
  { id: 2, author: 'You', text: 'You\re __right!__' },
];

export default data;
```


## Getting the server set up.
In our backend/server.js file, lets pull in all the packages we need and get a skeleton server set up.

Lets get our _package.json_ file set up so we can start our app up. Under "scripts":, add the
following three lines:

_package.json_

```js
"test": //... unchanged
"start:server": "cd backend && nodemon server.js --exec babel-node --presets es2015,stage-0",
"start:client": "cd client && yarn start",
"start:dev": "concurrently \"yarn start:server\" \"yarn start:client\""
```

this creates 3 commands we can now run. `$ yarn start:server` will only start our backend server, `$yarn start:client` will start our react app, and `$yarn start:dev` will start them both simultaneously (thanks to the concurrently package).

The babel-cli, babel-preset-stage-0 and babel-preset-es2105 packages allow us to use new javascript syntax in our server files. You can choose to not use these, but note that things like the `import` lines wont work, for example. You can opt to use `const express = require('express')` in that case. We may not use the stage-0 features, but I like to have them availble to play with.

_server.js_
```
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

const app = express();
const API_PORT = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('Hello, world');
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
```

All we are doing here is:
- lines 1-4: importing our dependencies
- line 6: creating an express instance to use.
- line 7: creating a constant to use for our port with either an environment variable you set or defaulting to port 3001.
- lines 9-11: setting up the body parser and logging in our express instance we created on line 6
- lines 13-15: making a hello world route to ensure everything is working correctly.
- line 17: starting the server with our API_PORT constant and a message saying which port it is running on.

Running `$ yarn start:server`, we will see a message saying "Listening on port 3001" or whichever port you set your variable up for.

Navigating to http://localhost:3001, you should see:
[[[TODO: IMG1.png]]]

And in your terminal, we can see what the `morgan` package is doing for us:
[[[TODO: IMG2.png]]]

Great! Now the real fun begins!

------------------------------------

Going forward, i will be using Postman to test our server, as it is easier to send POST requests to than using the command line `curl` function, but if you are more comfortable with that, feel free to use curl, you wacky hax0rz ;)

