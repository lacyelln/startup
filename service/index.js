const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const authCookieName = 'token';

// Store users and posts in memory
let users = [];
let readingPosts = [];
let writingPosts = [];

// Define server port
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// API Router
const apiRouter = express.Router();
app.use('/api', apiRouter);


// CreateAuth: Register a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const user = await createUserAccount(req.body.email, req.body.password);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

// GetAuth: Login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    return res.send({ email: user.email });
  }

  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth: Logout user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  
  if (user) {
    delete user.token;
  }

  res.clearCookie(authCookieName);
  res.status(204).end();
});

app.get('/api/user', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);

  if (!user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  res.json({ username: user.email }); // Assuming username is the email
});



// Get the authenticated user info
apiRouter.get('/auth/user', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    res.send({ email: req.user.email });
  }

  res.status(401).send({ msg: 'Unauthorized' });
});



// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);

  if (user) {
    req.user = user;  // Attach the user to the request
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};



apiRouter.get('/reading', verifyAuth, (req, res) => {
  const user = req.user; // The authenticated user

  // Separate the user's reviews from others
  const userReviews = readingPosts.filter(post => post.user === user.email);
  const otherReviews = readingPosts.filter(post => post.user !== user.email);

  res.json({ myReviews: userReviews, otherReviews: otherReviews });
});

// Get all writing posts
apiRouter.get('/writing', verifyAuth, (req, res) => {
  const user = req.user; // The user from the authentication middleware
  
  // Filter writings to only show the current user's writings
  const userWritings = writingPosts.filter(post => post.user === user.email);

  res.json({ myWritings: userWritings }); // Send only the user's writings
});


// Submit a reading post (book review)
apiRouter.post('/reading', verifyAuth, (req, res) => {
  const newPost = {
    id: uuid.v4(),
    title: req.body.title,
    review: req.body.review,
    rating: req.body.rating,
    user: req.user.email, 
  };

  readingPosts.push(newPost);
  res.status(201).send(newPost);
});

// Submit a writing post
apiRouter.post('/writing', verifyAuth, (req, res) => {
  const newPost = {
    id: uuid.v4(),
    title: req.body.title,
    content: req.body.content,
    user: req.body.user,
  };

  writingPosts.push(newPost);
  res.status(201).send(newPost);
});


async function createUserAccount(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email,
    password: passwordHash,
    token: uuid.v4(),
  };

  users.push(user);
  return user;
}

async function findUser(field, value) {
  return users.find((u) => u[field] === value);
}

// Set authentication cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Serve frontend for unknown routes
app.use((_req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});




  