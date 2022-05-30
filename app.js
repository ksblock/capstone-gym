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
const cors = require('./cors');

const conn = require('./config/db_config');

const indexRouter = require('./routes');
const gymRouter = require('./routes/gym');
const accountRouter = require('./routes/account');
const dataRouter = require('./routes/data');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3007);

app.use(morgan('dev'));
//app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(cors({origins: ["http://123.214.249.131:8080", "http://192.168.35.157:8080", "http://localhost:8080"]}));

app.set("trust proxy", 1);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    //sameSite: "none",
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({origins: ["http://localhost:8080", "http://192.168.0.102:8080", "http://192.168.35.157:8080"]}));

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/gym', gymRouter);
app.use('/data', dataRouter);

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
