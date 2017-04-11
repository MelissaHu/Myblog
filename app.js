var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require("./routes/index");
var settings = require('./settings');
var flash = require('connect-flash');
var multer = require('multer');
var app = express();


// view engine setup
// app.set('port',process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');






app.use(flash());  //外面直接下载的模块引用后，要使用前要加上这句话
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({
  dest: './public/images',
  rename: function (fieldname, filename) {
    return filename;
  }
}));



// app.use('/', index);
// app.use('/users', users);


//在 app.js 中通过 require 加载了 index.js 然后通过 routes(app) 调用了 index.js 导出的函数。

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
	resave:false,
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  saveUninitialized:true,
  cookie:{
  	 maxage:1000 * 60 * 30,
  },
  store: new MongoStore({
    //  db: settings.db,
    // host: settings.host,
    // port: settings.port
    url: 'mongodb://localhost/27017',
    collection:'sessions'

  })
}));

routes(app);



























app.listen(app.get('port'),function(){
	 console.log('Express server listening on port')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
