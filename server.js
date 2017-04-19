'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('express-flash');

const port = process.env.PORT || 5555;

let app = express();

// # DATABASE

require('./api/models/task.model');
mongoose.connect('mongodb://localhost/rest_api');

// # CONF

app.set('views', './api/views');
app.set('view engine', 'pug');

app.use(cookieParser('CEAF3FA4-F385-49AA-8FE4-54766A9874F1'));
app.use(session({
  secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
//app.use(csrf());


// Parse application/json
app.use(bodyParser.json());
// Parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

/*app.use((req, res, next) => {
  res.locals._csrf = req.csrfToken();
  return next();
})*/

// Middleware for passing flash message to all views
app.use((req, res, next) => {
  res.locals.flash = {
      success: req.flash('success'),
      error: req.flash('error')
  };
  next();
});

// # ROUTES

const routes = require('./api/routes');
let router = express.Router();

app.use('/', router);

router.get('/', (req, res) => {
    res.render('index');
});

routes(router);

app.use((req, res) =>{
    res.status(404).render('error');
});

app.listen(port);
console.log('App started on port : ', port);
