Ok, here we go! This is a _(much needed)_ update to me original MERN Facebook Comment box tutorial. That can be found (HERE)[www.example.com], but this is the new and improved version. I've 1) learned A TON since that last tutorial and, 2) the community has come to some best practices that we will implement here. The premise will be the same -- we will be building a Facebook-like comment box.

As before -- this tutorial expects a basic understanding of React -- this is a MERN tutorial, not a React tutorial. If you are not comfortable with React, I would highly recommend (their excellent docs) [www.example.com]

Anyways, lets get started.

## Initial folder structure

First things first, we need to make a place for all our code to live. To create a new folder and move us into it, lets enter into the terminal:
```
mkdir mern-comment-box && cd mern-comment-box
```

We will be using the npm package `create-react-app` for our base React code. This is an AMAZING package to get started, so if you dont have it, run:
```
npm i -g create-react-app
```

Now, we can run
```
create-react-app client
```
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
mkdir backend && mkdir backend/models && touch backend/models/comment.js && touch backend/server.js
```
