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
    //✅ req.tokenEmail = decoded.email;
    req.user = {
      email: decoded.email,
      uid: decoded.uid,
    };

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
    // const purchasesCollection = db.collection('purchases');
    // const favoritesCollection = db.collection('favorites');

    const verifyAdmin = async (req, res, next) => {
      const user = await usersCollection.findOne({ email: req.user.email });
      if (!user || !user.role?.includes('admin')) {
        return res.status(403).send({ message: 'Forbidden' });
      }
      next();
    };

    // save or update a user in db
    app.post('/user', async (req, res) => {
      const userData = req.body;

      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();
      userData.role = ['user'];

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
      console.log(req.user.email);
      const result = await usersCollection.findOne({ email: req.user.email });
      res.send({ role: result?.role || ['user'] });
    });

    // 👥 get all users with total lessons
    app.get('/manageUsers', verifyJWT, verifyAdmin, async (req, res) => {
      const users = await usersCollection.find().toArray();

      const usersWithStats = await Promise.all(
        users.map(async (u) => {
          const totalLessons = await lessonsCollection.countDocuments({
            'creator.email': u.email,
          });

          return {
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            totalLessons,
          };
        })
      );

      res.send(usersWithStats);
    });

    app.patch(
      '/manageUsers/promote/:id',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;

        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $addToSet: { role: 'admin' } } // duplicate এড়াবে
        );

        res.send(result);
      }
    );

    app.delete('/manageUsers/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;

      const result = await usersCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    //🌀 reported lessons
    app.get('/reported-lessons', verifyJWT, verifyAdmin, async (req, res) => {
      const result = await reportsCollection
        .aggregate([
          {
            $group: {
              _id: '$lessonId',
              reportCount: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'lessons',
              let: { lessonId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', { $toObjectId: '$$lessonId' }],
                    },
                  },
                },
                {
                  $project: {
                    title: 1,
                    category: 1,
                    accessLevel: 1,
                    creator: 1,
                  },
                },
              ],
              as: 'lesson',
            },
          },
          { $unwind: '$lesson' },
        ])
        .toArray();

      res.send(result);
    });

    app.get(
      '/reported-lessons/:lessonId',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const lessonId = req.params.lessonId;

        const reports = await reportsCollection.find({ lessonId }).toArray();
        res.send(reports);
      }
    );

    app.delete(
      '/reported-lessons/:lessonId',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const lessonId = req.params.lessonId;

        await lessonsCollection.deleteOne({ _id: new ObjectId(lessonId) });
        await reportsCollection.deleteMany({ lessonId });

        res.send({ success: true });
      }
    );

    app.patch(
      '/reported-lessons/:lessonId/ignore',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const lessonId = req.params.lessonId;

        await reportsCollection.updateMany(
          { lessonId },
          { $set: { status: 'ignored' } }
        );

        res.send({ success: true });
      }
    );

    // get all lessons (admin)
    app.get(
      '/admin/manage-lessons',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const { category, accessLevel, flagged } = req.query;

        let query = {};

        if (category) query.category = category;
        if (accessLevel) query.accessLevel = accessLevel;
        if (flagged === 'true') query.isReported = true;

        const lessons = await lessonsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();

        // 📊 Stats
        const publicCount = await lessonsCollection.countDocuments({
          accessLevel: 'public',
        });
        const privateCount = await lessonsCollection.countDocuments({
          accessLevel: 'private',
        });
        const flaggedCount = await lessonsCollection.countDocuments({
          isReported: true,
        });

        res.send({
          lessons,
          stats: {
            public: publicCount,
            private: privateCount,
            flagged: flaggedCount,
          },
        });
      }
    );

    app.patch(
      '/admin/lessons/:id/featured',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const { isFeatured } = req.body;

        const result = await lessonsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { isFeatured } }
        );

        res.send(result);
      }
    );

    app.patch(
      '/admin/lessons/:id/reviewed',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;

        const result = await lessonsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { isReviewed: true } }
        );

        res.send(result);
      }
    );

    app.delete(
      '/admin/lessons/:id',
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;

        const result = await lessonsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      }
    );

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

    // ✅ Get all lessons by logged-in user
    app.get('/lessons/my-lessons', verifyJWT, async (req, res) => {
      try {
        const email = req.user.email;
        const lessons = await lessonsCollection
          .find({ 'creator.email': email })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(lessons);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to fetch user lessons' });
      }
    });

    // get current user's favorite lessons
    app.get('/favorites', verifyJWT, async (req, res) => {
      try {
        const userId = req.user.uid;

        // fetch all lessons where this userId is in favorites array
        const favoriteLessons = await lessonsCollection
          .find({ favorites: userId })
          .toArray();

        res.send(favoriteLessons);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to fetch favorites' });
      }
    });

    // remove lesson from user's favorites
    app.post('/favorites/remove', verifyJWT, async (req, res) => {
      try {
        const userId = req.user.uid;
        const { lessonId } = req.body;

        const result = await lessonsCollection.updateOne(
          { _id: new ObjectId(lessonId) },
          { $pull: { favorites: userId }, $inc: { favoritesCount: -1 } }
        );

        res.send({ success: !!result.modifiedCount });
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to remove favorite' });
      }
    });

    // get single lessons from db by id
    app.get('/lessons/:id', verifyJWT, async (req, res) => {
      const id = req.params.id;

      const lesson = await lessonsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!lesson) {
        return res.status(404).send({ message: 'Lesson not found' });
      }

      // 🔥 get user role from DB
      const user = await usersCollection.findOne({
        email: req.user.email,
      });

      const roles = user?.role || ['user'];

      // 🔐 premium guard
      if (lesson.accessLevel === 'premium' && !roles.includes('premium')) {
        return res.status(403).send({
          message: 'Access denied. Upgrade to premium.',
        });
      }

      res.send(lesson);
    });

    // ✅ Update lesson (public/private, accessLevel, title, category, description)
    app.patch('/lessons/:id', verifyJWT, async (req, res) => {
      try {
        const id = req.params.id;
        const updates = req.body; // { title, category, description, accessLevel, isPublic }

        const lesson = await lessonsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!lesson)
          return res.status(404).send({ message: 'Lesson not found' });

        // Only creator can update
        if (lesson.creator.email !== req.user.email)
          return res.status(403).send({ message: 'Forbidden' });

        await lessonsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );

        const updatedLesson = await lessonsCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send({ message: 'Lesson updated', updatedLesson });
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to update lesson' });
      }
    });

    // ✅ Delete lesson
    app.delete('/lessons/:id', verifyJWT, async (req, res) => {
      try {
        const id = req.params.id;
        const lesson = await lessonsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!lesson)
          return res.status(404).send({ message: 'Lesson not found' });

        // Only creator can delete
        if (lesson.creator.email !== req.user.email)
          return res.status(403).send({ message: 'Forbidden' });

        const result = await lessonsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to delete lesson' });
      }
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
          { $addToSet: { role: 'premium' } }
        );

        res.send({ success: true, message: 'Premium Activated Successfully' });
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Payment verification failed' });
      }
    });

    // Admin overview stats
    app.get('/dashboard/admin-summary', verifyJWT, async (req, res) => {
      try {
        // check if user is admin
        const user = await usersCollection.findOne({ email: req.user.email });
        if (!user?.role.includes('admin')) {
          return res.status(403).send({ message: 'Access denied' });
        }

        const totalUsers = await usersCollection.countDocuments();
        const totalPublicLessons = await lessonsCollection.countDocuments({
          accessLevel: 'public',
        });
        const reportedLessons = await lessonsCollection.countDocuments({
          'comments.0': { $exists: true },
        });
        const topContributors = await lessonsCollection
          .aggregate([
            { $group: { _id: '$creator.email', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ])
          .toArray();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysLessons = await lessonsCollection.countDocuments({
          createdAt: { $gte: today.toISOString() },
        });

        res.send({
          totalUsers,
          totalPublicLessons,
          reportedLessons,
          topContributors,
          todaysLessons,
        });
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to fetch admin overview' });
      }
    });

    // 🔰 user summary
    app.get('/dashboard/user-summary', verifyJWT, async (req, res) => {
      try {
        const email = req.user.email;
        const userId = req.user.uid; // Firebase UID (must exist)

        const lessonsCollection = db.collection('lessons');

        // 🔹 1. Total lessons created by user
        const totalLessons = await lessonsCollection.countDocuments({
          'creator.email': email,
        });

        // 🔹 2. Total favorites by this user (FIXED)
        const totalFavorites = await lessonsCollection.countDocuments({
          favorites: userId,
        });

        // 🔹 3. Recent lessons
        const recentLessons = await lessonsCollection
          .find({ 'creator.email': email })
          .sort({ createdAt: -1 })
          .limit(5)
          .project({
            title: 1,
            category: 1,
            createdAt: 1,
            accessLevel: 1,
          })
          .toArray();

        // 🔹 4. Weekly activity (FIXED & RELIABLE)
        const weeklyActivity = await lessonsCollection
          .aggregate([
            { $match: { 'creator.email': email } },
            {
              $addFields: {
                createdDate: { $toDate: '$createdAt' }, // ✅ correct
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdDate' },
                  week: { $isoWeek: '$createdDate' },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': 1, '_id.week': 1 } },
            {
              $project: {
                week: {
                  $concat: [
                    { $toString: '$_id.year' },
                    '-W',
                    { $toString: '$_id.week' },
                  ],
                },
                count: 1,
                _id: 0,
              },
            },
          ])
          .toArray();

        res.send({
          totalLessons,
          totalFavorites,
          recentLessons,
          weeklyActivity,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Dashboard summary failed' });
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
