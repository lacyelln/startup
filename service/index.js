const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const db = require('./database.js');

const app = express();
const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// API Router
const apiRouter = express.Router();
app.use('/api', apiRouter);


// Authentication Routes
apiRouter.post('/auth/create', async (req, res) => {
  if (await db.getUser(req.body.email)) {
    return res.status(409).json({ msg: 'Existing user' });
  }

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = { email: req.body.email, password: passwordHash, token: uuid.v4() };

  await db.addUser(user);
  setAuthCookie(res, user.token);
  res.json({ email: user.email });
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await db.getUser(req.body.email);

  if (user && await bcrypt.compare(req.body.password, user.password)) {
    user.token = uuid.v4();
    await db.updateUser(user);
    setAuthCookie(res, user.token);
    return res.json({ email: user.email });
  }

  res.status(401).json({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await db.getUserByToken(req.cookies[authCookieName]);

  if (user) {
    user.token = null;
    await db.updateUser(user);
  }

  res.clearCookie(authCookieName);
  res.status(200).json({ msg: "Logged out" });
});

// Middleware for authentication
const verifyAuth = async (req, res, next) => {
  const user = await db.getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  req.user = user;
  next();
};

apiRouter.get('/user', verifyAuth, async (req, res) => {
  if (req.user) {
    res.json({ username: req.user.email });  // Send back the user's email (or other data)
  } else {
    res.status(401).json({ msg: 'Unauthorized' });
  }
});

apiRouter.get('/reading', verifyAuth, async (req, res) => {
  try {
    // Fetch reviews from the database
    const userReviews = await db.getReviewsByUser(req.user.email);
    const otherReviews = await db.getOtherReviews(req.user.email);
    
    res.json({ myReviews: userReviews, otherReviews: otherReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ msg: 'Error fetching reviews' });
  }
});


// // Reading & Writing Posts
// apiRouter.get('/reading', verifyAuth, async (req, res) => {
//   const myReviews = await bookCollection.find({ user: req.user.email }).toArray();
//   const otherReviews = await bookCollection.find({ user: { $ne: req.user.email } }).toArray();
//   res.json({ myReviews, otherReviews });
// });

apiRouter.post('/reading', verifyAuth, async (req, res) => {
  // Destructure required data from request body
  const { title, review, rating } = req.body;
  const userEmail = req.user.email;

  const newPost = { 
    id: uuid.v4(), 
    title, 
    review, 
    rating, 
    user: userEmail 
  };

  try {
  
    await db.addReview(newPost);
    console.log('Review saved to the database');
    res.status(201).json(newPost); 
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ msg: 'Failed to submit review. Please try again later.' });
  }
});


apiRouter.get('/writing', verifyAuth, async (req, res) => {
  try {
    const userWritings = await db.getWritingsByUser(req.user.email);
    const otherWritings = await db.getOtherWritings(req.user.email);
    res.json({ myWritings: userWritings, otherWritings: otherWritings });
  } catch (error) {
    console.error('Error fetching writings:', error);
    res.status(500).json({ msg: 'Error fetching writings' });
  }
});


apiRouter.post('/writing', verifyAuth, async (req, res) => {
  const newPost = { 
    id: uuid.v4(), 
    title: req.body.title, 
    content: req.body.content, 
    user: req.user.email 
  };

  try {
    await db.addWriting(newPost); // Make sure this inserts the post into the database
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error posting writing:', error);
    res.status(500).json({ msg: 'Error posting writing' });
  }
});


// Set authentication cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, { secure: true, httpOnly: true, sameSite: 'strict' });
}



// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
