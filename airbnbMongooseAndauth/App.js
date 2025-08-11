// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const DB_PATH = "mongodb+srv://<username>:<password>@codewithjs.a0vhajb.mongodb.net/airbnbMongo?retryWrites=true&w=majority&appName=CodeWithJs";

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/utilPath");
const authRouter = require("./routes/authRouter");
const errorsController = require("./controllers/errors");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

app.use(session({
  secret: 'mongooseCodewithajay',
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mongooseCodewithajay',
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  req.session.isLoggedIn = req.session.isLoggedIn || false;
  next();
});
app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const PORT = 3000;
mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});
