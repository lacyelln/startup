const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('web');

const userCollection = db.collection('users');
const bookCollection = db.collection('books');
const writingCollection = db.collection('writings');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB');
  } catch (ex) {
    console.log(`Unable to connect to database: ${ex.message}`);
    process.exit(1);
  }
})();

async function getUser(email) {
  return userCollection.findOne({ email: email });
}

async function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function addReview(review) {
  return bookCollection.insertOne(review);
}

async function getReviewsByUser(email) {
  return bookCollection.find({ user: email }).toArray();
}

async function getOtherReviews(email) {
  return bookCollection.find({ user: { $ne: email } }).toArray();
}

async function addWriting(writing) {
  return writingCollection.insertOne(writing);
}

async function getWritingsByUser(email) {
  return writingCollection.find({ user: email }).toArray();
}
async function getOtherWritings(email) {
    return bookCollection.find({ user: { $ne: email } }).toArray();
  }

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addReview,
  getReviewsByUser,
  getOtherReviews,
  addWriting,
  getWritingsByUser,
  getOtherWritings
};
