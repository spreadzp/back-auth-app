const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const cors = require("cors");
const MongoStore = require('connect-mongo')(session);

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const info = require('./routes/info');
const latency = require('./routes/latency');
const verifyJWT_MW = require('./middlewares/verifierJwt');
 
// DB Config
const db = require('./config/database');

require('dotenv').config();
const secretSession = process.env.SECRETSESSION || 'some other secret sesion as default';

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({ 
  secret: secretSession, 
  saveUninitialized: true,
  resave: true,
  // using store session on MongoDB using express-session + connect
  store: new MongoStore({
    url: db.mongoURI,
    collection: 'sessions'
  })
}));  

app.use(flash());

// Global variables
app.use(function(req, res, next){ 
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
}); 

/* app.get('/logout', (req, res) => {
  res.render('logout');
}); */

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);
app.use('/info', info);
app.use('/latency', latency);

module.exports = app;
