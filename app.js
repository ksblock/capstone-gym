const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql2');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportConfig = require('./passport');
const cors = require('cors');

const conn = require('./config/db_config');

const indexRouter = require('./routes');
const gymRouter = require('./routes/gym');
const accountRouter = require('./routes/account');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3007);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use(cors({
  origin: true,
  credential: true
}));

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/gym', gymRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});
  
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
