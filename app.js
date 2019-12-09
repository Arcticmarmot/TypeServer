const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const openRouter = require('./routes/open.js');
const uploadRouter = require('./routes/upload');
const authUploadRouter = require('./routes/auth-upload');
const articleRouter = require('./routes/article');
const sendMailRouter = require('./routes/send-email');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile');
const logoutRouter = require('./routes/logout');
const authorizeRouter = require('./routes/authorize');
const resultRouter = require('./routes/result');
const resetRouter = require('./routes/reset');
const authAdminRouter = require('./routes/auth-admin');
const recordRouter = require('./routes/record');
const recordDetailRouter = require('./routes/record-detail');
const deleteArticleRouter = require('./routes/delete-article');
const {MAX_AGE} = require("./utils/constant");
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  cookie: {maxAge: MAX_AGE,httpOnly:false},
  secret: 'typewrite2019',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost:27017/TypeSession'
  })
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  if(req.path !== '/' && !req.path.includes('.')){
    res.set({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      'Content-Type': 'application/json; charset=utf-8'
    })
  }
  req.method === 'OPTIONS' ? res.status(204).end() : next()
});
app.use('/', indexRouter);

app.post('/upload',uploadRouter.submit);
app.post('/auth_upload',authUploadRouter.submit);
app.get('/open',openRouter.form);
app.get('/article',articleRouter.form);
app.post('/send',sendMailRouter.send);
app.post('/register',registerRouter.register);
app.post('/reset',resetRouter.reset);
app.post('/login',loginRouter.login);
app.get('/logout',logoutRouter.logout);
app.get('/profile',profileRouter.getProfile);
app.post('/profile',profileRouter.postProfile);
app.get('/authorize',authorizeRouter.authorize);
app.get('/auth_admin',authAdminRouter.auth_admin);
app.get('/result',resultRouter.getResult);
app.get('/record',recordRouter.getRecord);
app.post('/result',resultRouter.postResult);
app.post('/record_detail',recordDetailRouter.recordDetail);
app.delete('/delete',deleteArticleRouter.deleteArticle);

app.use(function(err, req, res, next) {
  res.writeHead(err.status || 500,err.message,
      {'Content-Type': 'application/json;charset=utf8'}
  );
  res.end(JSON.stringify({text:err.text || ''}));
});

module.exports = app;
