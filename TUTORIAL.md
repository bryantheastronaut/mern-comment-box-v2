Ok, here we go! This is a _(much needed)_ update to me original MERN Facebook Comment box tutorial. That can be found [here](https://medium.com/@bryantheastronaut/react-getting-started-the-mern-stack-tutorial-feat-es6-de1a2886be50), but this is the new and improved version. I've 1) learned A TON since that last tutorial and, 2) the community has come to some best practices that we will implement here. The premise will be the same -- we will be building a Facebook-like comment box.

As before -- this tutorial expects a basic understanding of React -- this is a MERN tutorial, not a React tutorial. If you are not comfortable with React, I would highly recommend [their excellent docs](https://reactjs.org/)

Anyways, lets get started.

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


Lets do some clean-up in our client folder. First, we can `$ cd client` for easier terminal access to files and folders we are currently using. (Protip: hitting tab as you are typing folders/files in the terminal will auto-complete for you if it can figure it out) We can `$ rm src/logo.svg src/App.css src/App.test.js src/App.js`, as we dont need these. Now, lets make all the components we need. In a larger app, i would break these out into _Container_ and _Component_ folders, but since we are only dealing with a few files, we can keep them all under _src/_. Lets `$ cd src && touch CommentList.js CommentBox.js CommentForm.js Comment.js data.js CommentBox.css` to make all the files we need. The data file will contain hardcoded data for intial testing, but by the end we will remove it, as all our data will live in our database.

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

We need the `react-markdown` package to convert markdown to text, and we need something to fetch data from the browser. For this, we will use the `whatwg-fetch` package, which is a polyfill for the window.fetch object. We will also bring in the `prop-types` package to use to ensure we are getting the expected type in to our component.So we can `$ yarn add react-markdown whatwg-fetch prop-types`.

We will also be using eslint to catch errors some easy problems, and defining our prop types to check that the data we are getting passed in is what we expect.

`$ yarn add --dev eslint babel-eslint` will get us the prop types, eslint, and eslint babel parser package. I use the airbnb eslint rules, and we can go to [the npmjs page](https://www.npmjs.com/package/eslint-config-airbnb) and see a command to get it with all its depedencies. Since we are using yarn instead of npm, we will modify it slighly, replacing the `npm install --save-dev` with `yarn add --dev`, like so:

```
(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev "$PKG@latest"
)
```

Note: This works with UNIX and iOS, see the eslint airbnb page for Windows). We should now add an _.eslintrc.json_ file which will set up and modify the rules we want to use. Making sure you are under the _client_ folder, run `$ touch .eslintrc.json`. In that file, add:

```
{
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "ecmaFeatures": {
    "arrowFunctions": true
  },
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "rules": {
    "no-use-before-define": [0],
    "react/jsx-filename-extension": [0],
    "jsx-a11y/anchor-is-valid": [0],
    "no-confusing-arrow": [0],
    "no-underscore-dangle": [0],
    "import/no-extraneous-dependencies": [0]
  }
}
```

Feel free to change these rules as you see fit, as long as you are using a consistent style that works for you.

These are how the files will statically look, and going forward we will replace the hardcoded values with dynamically generated things fromthe server.

```
// CommentBox.js
import React, { Component } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import DATA from './data';
import './CommentBox.css';

class CommentBox extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }
  render() {
    return (
      <div className="container">
        <div className="comments">
          <h2>Comments:</h2>
          <CommentList data={DATA} />
        </div>
        <div className="form">
          <CommentForm />
        </div>
      </div>
    );
  }
}

export default CommentBox;

```

```
// CommentList.js
import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

const CommentList = (props) => {
  const commentNodes = props.data.map(comment => (
    <Comment author={comment.author} key={comment._id} id={comment._id}>
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
      name="text"
      placeholder="Say something..."
      value={props.text}
      onChange={props.handleChangeText}
    />
    <button type="submit">Submit</button>
  </form>
);

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  text: PropTypes.string,
  author: PropTypes.string,
};

CommentForm.defaultProps = {
  text: '',
  author: '',
};

export default CommentForm;

```

```
// Comment.js
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Comment = props => (
  <div className="singleComment">
    <img alt="user_image" className="userImage" src={`https://picsum.photos/70?random=${props.id}`} />
    <div className="textContent">
      <div className="singleCommentContent">
        <h3>{props.author}</h3>
        <ReactMarkdown source={props.children} />
      </div>
      <div className="singleCommentButtons">
      </div>
    </div>
  </div>
);

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default Comment;

```

```
// data.js
const data = [
  { _id: 1, author: 'Bryan', text: 'Wow this is neat', updatedAt: new Date(), createdAt: new Date() },
  { _id: 2, author: 'You', text: 'You\'re __right!__', updatedAt: new Date(), createdAt: new Date() },
];

export default data;

```

```
// CommentBox.css
.container {
  background-color: #f1f1f1;
  box-sizing: border-box;
  padding: 25px;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;

}

.comments {
  overflow: auto;
  width: 75%;
  max-width: 700px;
  min-width: 300px;
}

.comments h2 {
  font-weight: 300;
}

.singleComment {
  padding: 10px 20px;
  margin-bottom: 10px;
  display: flex;
}

.singleCommentContent {
  min-width: 100px;
  background-color: #fff;
  border-radius: 25px;
  padding: 10px;
  display: inline-flex;
}

.userImage {
  height: 35px;
  margin-right: 10px;
  border-radius: 50%;
}


.singleCommentContent h3 {
  margin: 0;
  padding-right: 5px;
  font-size: 12px;
  color: #385997;
}

.singleCommentContent p {
  font-size: 12px;
  margin: 0;
}

.singleCommentButtons {
  padding-top: 5px;
}

.time {
  font-size: 10px;
  padding-left: 5px;
  padding-right: 5px;
  color: #999;
}

.singleCommentButtons a {
  margin: 0px 3px;;
  padding-top: 10px;
  cursor: pointer;
  font-size: 10px;
  color: #385997;
  letter-spacing: 0.05em;
}

.form {
  width: 70%;
  min-width: 300px;
  max-width: 700px;
}

.form form {
  display: flex;
  padding: 15px 0;
}

.form input {
  height: 30px;
  padding-left: 10px;
  border: 1px solid #c1c1c1;
  margin-right: 10px;
  border-radius: 20px;
  flex: 3;
}

.form input:first-child {
  flex: 1;
}

.form button {
  color: #999;
  border-radius: 5px;
  border: 1px solid #999;
}

.form button:hover {
  cursor: pointer;
  color: #385997;
  border-color: #385997;
}
```

At this point, you may notice some linting errors. They are ok for now, as they will be resolved through our development. If we fire up our React app with `$ yarn start` in the _clients/_ folder, we should see something like this:


## Getting the server set up.

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

In our backend/server.js file, lets pull in all the packages we need and get a skeleton server set up.

_server.js_
```
// server.js

// first we import our dependencies…
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

// and create our instances
const app = express();
const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;
// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

```

Running `$ yarn start:server`, we will see a message saying "Listening on port 3001" or whichever port you set your variable up for.

Great! Now the real fun begins!

------------------------------------

Going forward, i will be using Postman to test our server, as it is easier to send POST requests to than using the command line `curl` function, but if you are more comfortable with that, feel free to use curl, you wacky hax0rz ;)

## Integrating the database

For this part, I will be using MLab which [you can find here](https://www.mlab.com). It is a database-as-a-service provider for MongoDB. Make a free account, then log in. Click on the Users tab, and click add database user. Once you have a username and password, we can integrate it into our server.js file.

On your MLab page, you should see something at the top that looks like this:


We will use the connect “using a driver via the standard MongoDB URI” option. Copy that link, and we will create a secrets file to put it in.

Making sure you are back in the _backend/_ folder, we should `$ touch secrets.js`. I will not be doing this (for the sake of you being able to see the file), but be sure
to put your secrets.js file in your .gitignore folder! Or, you can use environment variables and reference them that way -- which is what i will be doing.

To set things as environment variables, you can add them to your .bash_profile as exports, or do it via the command line. Since this is out of scope of this tutorial, i will just say if you want to use environment variables, you can type `$ export DB_URI=mongodb://<dbuser>:<dbpassword>@ds161529.mlab.com:61529/mern-comment-box` (replacing <dbuser> and <dbpassword> with the username and password you created through mlab). To read more about using environment variables, see [this great article](https://medium.com/ibm-watson-data-lab/environ`ment-variables-or-keeping-your-secrets-secret-in-a-node-js-app-99019dfff716) by Glynn Bird. If you prefer, you can replace `process.env.DB_URI` in the secrets.js folder below with it, but be sure not to commit it ot your repo!

```
// secrets.js
const secrets = {
  dbUri: process.env.DB_URI
};

export const getSecret = key => secrets[key];
```
(Thanks to ssanaul and pjcevans for the github PR's with the secrets feature and fixing the mongoose warning!)

Now, we can connect our database in our server.js:

```
// server.js
import { getSecret } from './secrets';
// ... removed for brevity
const API_PORT = process.env.API_PORT || 3001;

// db config -- set your URI from mLab in secrets.js
mongoose.connect(getSecret('dbUri'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
```

Next we will need to create the Schema that will show what our database entries look like.
```
// model/comment.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const CommentsSchema = new Schema({
  author: String,
  text: String,
}, { timestamps: true });

// export our module to use in server.js
export default mongoose.model('Comment', CommentsSchema);

```

Now back in our server.js file we import that with our dependencies:
```
// server.js
// ...
import { getSecret } from './secrets';
import Comment from './models/comment';
// ...
```

## Getting and posting to the database

In our server.js file, we can now create a new route and give it GET and POST HTTP methods to retrieve data from and post data to our database we connected. Add this in below our root route:

```
// server.js
//...
  res.json({ message: 'Hello, World!' });
});

router.get('/comments', (req, res) => {
  Comment.find((err, comments) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: comments });
  });
});

router.post('/comments', (req, res) => {
  const comment = new Comment();
  // body parser lets us use the req.body
  const { author, text } = req.body;
  if (!author || !text) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide an author and comment'
    });
  }
  comment.author = author;
  comment.text = text;
  comment.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});
/ ...

```

Note: If you are not familiar with object destructuring, `const { author, text } = req.body;` may seem a little strange. This is basically just pulling those fields off the req.body object and creating two variables (author and text) from those values.


Note that after you save, nodemon will automatically restart your server, so changes should be instantaneous. Now if we use Postman to check out our route we just created, /api/comments we see…. Nothing!

This is because our database is empty! Lets test out our brand new POST method we created and add our first comment! If we send a POST request to the same route /api/comments and put our author and text in, we should see our success message.

## Back to React!

Now that were back on the front end, lets get our data from our brand new server! First, in our _client/package.json_ file, lets add a proxy. This basically just tells our react app to try to use this other url if it cannot resolve the endpoint through its own. Now, instead of fetching from 'http://localhost:3001/api/comments/', we can just use '/api/comments/'
```
// package.json
// ...at the bottom, right before the last `}`
  },
  "proxy": "http://localhost:3001"
}
// end of file
```

Now, were going to set a poller to fetch data from the server every 2 seconds (2000 miliseconds). This is just going to hit our `/api/comments` endpoint and return an array of data. We will also add a bit of state to check for errors. If we recieve an error, we can print it to screen to show the user.
```
// CommentBox.js
import React, { Component } from 'react';
import 'whatwg-fetch';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      error: null,
      author: '',
      text: ''
    };
    this.pollInterval = null;
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadCommentsFromServer, 2000);
    }
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

  loadCommentsFromServer = () => {
    // fetch returns a promise. If you are not familiar with promises, see
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    fetch('/api/comments/')
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ data: res.data });
      });
  }

  render() {
    return (
      <div className="container">
        <div className="comments">
          <h2>Comments:</h2>
          <CommentList data={this.state.data} />
        </div>
        <div className="form">
          <CommentForm author={this.state.author} text={this.state.text} />
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default CommentBox;

```

Now when we start our server, we should see the comment that we posted earlier via Postman! We are also adding an error state, and a place to show errors if any come through, and setting the author and text to bits of state that we pass into _CommentForm.js_

## Git sidequest
If you are following along using git, once this is working correctly it would be a great place to commit!)
```
$ git status // ... lots of uncommited changes in red
$ git add . // add all your changes (replace . with specific files if you want to break work in seperate commits)
$ git commit -m 'Creating get/post route for comments endpoint and creating fetching live data from server in CommentBox'
```

## Front End: Posting a new comment

Now we should hook up our inputs so we can post new comments through the site, not just through Postman. In _CommentBox.js_:

```
// CommentBox.js
// ...

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submitComment = (e) => {
    e.preventDefault();
    const { author, comment } = this.state;
    if (!author || !comment) return;
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, comment }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ author: '', text: '', error: null });
    });
  }
  // ...
  // and inside render...
    <CommentForm
      author={this.state.author}
      text={this.state.text}
      handleChangeText={this.onChangeText}
      handleSubmit={this.submitComment}
    />
    // ...
```
There are a few interesting things going on here. We're using a promise to post to our server. If you're not familiar with promises, this is pretty much just an async function. It will start and finish at some later time. The `.then` fires and converts the response to json, the following `.then` takes that json and does what we want with it, either showing an error or clearing out our inputs. We are also object destructuring again to get the __author__ and __text__ variables out. This just makes the body easier to read for ourselves.


Now when you look at your react app, the new comment we added to the database via Postman is there! If you look in your developer console, we have a warning saying ‘Each child in an array or iterator should have a unique “key” prop…’. MongoDB adds an ID tag to each post labeled “_id”. We can change our CommentList component to use it like so:
```
// CommentList.js
// ...
<Comment author={comment.author} key={comment._id} id={comment._id} timestamp={comment.updatedAt}>
// ...
```

## Optimizing Comments

We can finish up the (old, now defunct, but still interesting) Facebook tutorial now with a bit of optimization to our CommentBox component.

```
// CommentBox.js
// ...
  submitComment = (e) => {
    e.preventDefault();
    const { author, text } = this.state;
    if (!author || !text) return;
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ author: '', text: '', error: null });
    });
  }
// ...
```

Here, we are creating a new variable called data. This data is made up of our array of state (using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)), which takes each element out of the state array and puts it in the new array. After, we append the new comment to the end, and set this variable to our state.

## Putting the UD in CRUD

Lets hop back in to our server.js file one more time to add the PUT(Update) and DELETE(…Delete) routes to our API. We will need to direct them to a specific post, so we can use the `:params` route to specify which comment we are referring to.

```
// server.js
// ...
router.put('/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.json({ success: false, error: 'No comment id provided' });
  }
  Comment.findById(commentId, (error, comment) => {
    if (error) return res.json({ success: false, error });
    const { author, text } = req.body;
    if (author) comment.author = author;
    if (text) comment.text = text;
    comment.save(error => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true });
    });
  });
});

router.delete('/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.json({ success: false, error: 'No comment id provided' });
  }
  Comment.remove({ _id: commentId }, (error, comment) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true });
  });
});
// ...
```

Now if we go back in to Postman, we can send either a DELETE or PUT request with the “_id” at the end of the url. Sending a DELETE request will remove it, and sending a PUT request with a different author or text will update the comment.

If we go back into _CommentBox.js_, we can add a couple new methods that will handle our update and delete logic. All we need to do is call fetch again, this time passing in the id of the comment we want to either update or delete. We can also refactor the submit comment a bit to handle both sending updates of existing comments as well as new comments. We can add a new bit of state, `updateId`, which can either be null or an id. If it is an id, that is the comment which will be updated. If it is null, a new comment will be posted. Not exactly bulletproof logic, but good enough for this example.

```
// CommentBox.js
// ...
onUpdateComment = (id) => {
    const oldComment = this.state.data.find(c => c._id === id);
    if (!oldComment) return;
    this.setState({ author: oldComment.author, text: oldComment.text, updateId: id });
  }

  onDeleteComment = (id) => {
    const i = this.state.data.findIndex(c => c._id === id);
    const data = [
      ...this.state.data.slice(0, i),
      ...this.state.data.slice(i + 1),
    ];
    this.setState({ data });
    fetch(`api/comments/${id}`, { method: 'DELETE' })
      .then(res => res.json()).then((res) => {
        if (!res.success) this.setState({ error: res.error });
      });
  }

  submitComment = (e) => {
    e.preventDefault();
    const { author, text, updateId } = this.state;
    if (!author || !text) return;
    if (updateId) {
      this.submitUpdatedComment();
    } else {
      this.submitNewComment();
    }
  }

  submitNewComment = () => {
    const { author, text } = this.state;
    const data = [
      ...this.state.data,
      {
        author, text, _id: Date.now().toString(), updatedAt: new Date(), createdAt: new Date()
      },
    ];
    this.setState({ data });
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ author: '', text: '', error: null });
    });
  }

  submitUpdatedComment = () => {
    const { author, text, updateId } = this.state;
    fetch(`/api/comments/${updateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ author: '', text: '', updateId: null });
    });
  }
// ...
// inside render...
    <CommentList
      data={this.state.data}
      handleDeleteComment={this.onDeleteComment}
      handleUpdateComment={this.onUpdateComment}
    />
```

Now, we just need to pass those methods into _Comment.js_ through _CommentList.js_:

```
// CommentList.js
import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

const CommentList = (props) => {
  const commentNodes = props.data.map(comment => (
    <Comment
      author={comment.author}
      key={comment._id}
      id={comment._id}
      timestamp={comment.updatedAt}
      handleUpdateComment={props.handleUpdateComment}
      handleDeleteComment={props.handleDeleteComment}
    >
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
    updatedAt: PropTypes.string,
  })),
  handleDeleteComment: PropTypes.func.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
};

CommentList.defaultProps = {
  data: [],
};

export default CommentList;

  ```
  and Comment becomes:

  ```
// Comment.js
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Comment = props => (
  <div className="singleComment">
    <img alt="user_image" className="userImage" src={`https://picsum.photos/70?random=${props.id}`} />
    <div className="textContent">
      <div className="singleCommentContent">
        <h3>{props.author}</h3>
        <ReactMarkdown source={props.children} />
      </div>
      <div className="singleCommentButtons">
        <a onClick={() => { props.handleUpdateComment(props.id); }}>update</a>
        <a onClick={() => { props.handleDeleteComment(props.id); }}>delete</a>
      </div>
    </div>
  </div>
);

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default Comment;

```

Note, we are adding links in to comment as well to update and delete each comment.

Finally, for the finishing touch, we can add the `moment` package. Making sure we are in the _client/_ directory, `$ yarn add moment`. Now, importing that into _Comment.js_ and using it like so right above the two `<a>` tags will give us a nicely formatted relative time of the post:

```
// Comment.js
<div className="singleCommentButtons">
  <span className="time">{moment(props.timestamp).fromNow()}</span>
  <a onClick={() => { props.handleUpdateComment(props.id); }}>update</a>
  <a onClick={() => { props.handleDeleteComment(props.id); }}>delete</a>
</div>
```

There you have it! Hopefully thats enough to get you started! Please let me know if you have any issues, comments, or anything. Im on twitter at @space_brayn

Also, if there is any way you think of to help improve this tutorial, __please__ make a pull request on the github repo! I'd love contributors!


<3 bryan