require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const admin = require('firebase-admin');
const port = process.env.PORT || 3000;

// 🌳stripe code
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// firebase admin SDK
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString(
  'utf-8'
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
// middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://b12-m11-session.web.app',
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());

// jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1];
  console.log(token);
  if (!token) return res.status(401).send({ message: 'Unauthorized Access!' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: 'Unauthorized Access!', err });
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db('lessonsDB');
    const lessonsCollection = db.collection('lessons');
    const usersCollection = db.collection('users');
    const reportsCollection = db.collection('reports');
    const purchasesCollection = db.collection('purchases');
    const favoritesCollection = db.collection('favorites');

    // save or update a user in db
    app.post('/user', async (req, res) => {
      const userData = req.body;

      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();
      userData.role = 'user';

      const query = { email: userData.email };

      const alreadyExists = await usersCollection.findOne(query);
      console.log('user already Exists --->', !!alreadyExists);

      if (alreadyExists) {
        console.log('updating user info..........');
        const result = await usersCollection.updateOne(query, {
          $set: {
            last_loggedIn: new Date().toISOString(),
          },
        });
        return res.send(result);
      }
      console.log('Saving new user info..........');
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // get a user's role
    app.get('/user/role', verifyJWT, async (req, res) => {
      const result = await usersCollection.findOne({ email: req.tokenEmail });
      res.send({ role: result?.role || 'customer' });
    });

    // Save a plant data in db
    app.post('/lessons', async (req, res) => {
      const lessonsData = req.body;
      lessonsData.createdAt = new Date();
      const result = await lessonsCollection.insertOne(lessonsData);
      res.send(result);
    });

    // Most saved lessons
    app.get('/lessons/most-saved', async (req, res) => {
      const result = await lessonsCollection
        .find()
        .sort({ saves: -1 })
        .limit(6)
        .toArray();

      res.send(result);
    });

    // Home page API
    app.get('/lessons/featured', async (req, res) => {
      const result = await lessonsCollection
        .find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(result);
    });

    // get all lessons from db
    app.get('/lessons', async (req, res) => {
      const result = await lessonsCollection.find().toArray();
      res.send(result);
    });

    // get single lessons from db by id
    app.get('/lessons/:id', async (req, res) => {
      const id = req.params.id;
      const lesson = await lessonsCollection.findOne({ _id: new ObjectId(id) });

      if (!lesson) {
        return res.status(404).send({ message: 'Lesson not found' });
      }

      // If lesson is premium → user must be premium
      if (lesson.accessLevel === 'premium' && req.user.role !== 'premium') {
        return res.status(403).send({
          message: 'Access denied. Upgrade to premium.',
        });
      }

      res.send(lesson);
    });

    app.get('/pricing', async (req, res) => {
      const result = await lessonsCollection.find().toArray();
      res.send(result);
    });

    //  এখানে নতুন API যুক্ত করা হলো

    // Like/Unlike Lesson
    app.post('/lessons/:id/like', async (req, res) => {
      const lessonId = req.params.id;
      const { userId } = req.body;
      const lesson = await lessonsCollection.findOne({
        _id: new ObjectId(lessonId),
      });
      if (!lesson)
        return res.status(404).send({ message: 'Lesson not found!' });

      const likes = lesson.likes || [];
      let likesCount = lesson.likesCount || 0;

      if (likes.includes(userId)) {
        // remove like
        await lessonsCollection.updateOne(
          { _id: new ObjectId(lessonId) },
          { $pull: { likes: userId }, $inc: { likesCount: -1 } }
        );
      } else {
        //  add like
        await lessonsCollection.updateOne(
          { _id: new ObjectId(lessonId) },
          { $addToSet: { likes: userId }, $inc: { likesCount: 1 } }
        );
      }

      const updatedLesson = await lessonsCollection.findOne({
        _id: new ObjectId(lessonId),
      });
      res.send(updatedLesson);
    });

    // Save/Remove Favorite
    app.post('/lessons/:id/favorite', async (req, res) => {
      const lessonId = req.params.id;
      const { userId } = req.body;
      const lesson = await lessonsCollection.findOne({
        _id: new ObjectId(lessonId),
      });
      if (!lesson)
        return res.status(404).send({ message: 'Lesson not found!' });

      const favorites = lesson.favorites || [];
      let favoritesCount = lesson.favoritesCount || 0;

      if (favorites.includes(userId)) {
        //  remove favorite
        await lessonsCollection.updateOne(
          { _id: new ObjectId(lessonId) },
          { $pull: { favorites: userId }, $inc: { favoritesCount: -1 } }
        );
      } else {
        //  add favorite
        await lessonsCollection.updateOne(
          { _id: new ObjectId(lessonId) },
          { $addToSet: { favorites: userId }, $inc: { favoritesCount: 1 } }
        );
      }

      const updatedLesson = await lessonsCollection.findOne({
        _id: new ObjectId(lessonId),
      });
      res.send(updatedLesson);
    });

    // Report Lesson
    app.post('/lessonsReports', async (req, res) => {
      const reportData = req.body;
      //  report save
      const result = await reportsCollection.insertOne(reportData);
      res.send({ message: 'Report submitted', result });
    });

    // Add Comment
    app.post('/lessons/:id/comments', async (req, res) => {
      const lessonId = req.params.id;
      const { userId, userName, text } = req.body;
      const comment = {
        _id: new ObjectId(),
        userId,
        userName,
        text,
        createdAt: new Date(),
      };

      //  push comment to lesson
      await lessonsCollection.updateOne(
        { _id: new ObjectId(lessonId) },
        { $push: { comments: comment } }
      );

      res.send({ message: 'Comment added', comment });
    });

    //  Add view tracking API
    app.post('/lessons/:id/view', async (req, res) => {
      const id = req.params.id;
      const lesson = await lessonsCollection.findOne({ _id: new ObjectId(id) });
      if (!lesson) return res.status(404).send({ message: 'Lesson not found' });

      // Increment viewsCount
      const updated = await lessonsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { viewsCount: 1 } }
      );

      res.send({ message: 'View incremented' });
    });

    // Top contributors
    app.get('/users/top-contributors', async (req, res) => {
      const result = await lessonsCollection
        .aggregate([
          {
            $group: {
              _id: '$authorId',
              totalLessons: { $sum: 1 },
            },
          },
          { $sort: { totalLessons: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: 'uid',
              as: 'authorInfo',
            },
          },
          { $unwind: '$authorInfo' },
        ])
        .toArray();

      res.send(result);
    });

    // Mark as featured
    app.patch('/lessons/:id/featured', async (req, res) => {
      const id = req.params.id;
      const { isFeatured } = req.body;

      const result = await lessonsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isFeatured } }
      );

      res.send(result);
    });

    // 🌳 Payment endpoints
    app.post('/create-checkout-session', async (req, res) => {
      const { price, userEmail } = req.body;

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: [
            {
              price_data: {
                currency: 'usd',
                unit_amount: price * 100,
                product_data: {
                  name: 'LessonFlow Premium Access',
                },
              },
              quantity: 1,
            },
          ],
          customer_email: userEmail,
          success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `http://localhost:5173/pricing`,
        });

        res.send({ url: session.url });
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Stripe Session Failed' });
      }
    });

    // 🌳 Payment -- success page api
    app.post('/payment-success', async (req, res) => {
      const { sessionId } = req.body;

      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const email = session.customer_details.email;

        await usersCollection.updateOne(
          { email },
          { $set: { role: 'premium' } }
        );

        res.send({ success: true, message: 'Premium Activated Successfully' });
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Payment verification failed' });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from Server..');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
