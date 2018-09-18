const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const http = require('http');
const appConfig = require('./config/appConfig');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger.js');
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler');
const mongoose = require('mongoose');
const morgan = require('morgan');



app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);



app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});

fs.readdirSync('./app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require('./app/models' + '/' + file)
});

fs.readdirSync('./app/routes').forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require('./app/routes' + '/' + file);
    route.setRouter(app);
  }
});


app.use(globalErrorMiddleware.globalNotFoundHandler);


/**
 * Create HTTP server.
 */

const server = http.createServer(app);
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

// socket stuffs here
const socketLib = require('./app/libs/socketLib');
const socketServer = socketLib.setServer(server);



function onError(error) {
  if (error.syscall !== 'listen') {
    console.log(error.code , ' not equal listen serverOnErrorHandler')
    throw error;
  }


  // error handler for connections
  switch (error.code) {
    case 'EACCES':
      console.log(error.code ,'serverOnErrorHandler');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(error.code , 'serverOnErrorHandler');
      process.exit(1);
      break;
    default:
      console.log(error.code,':some unknown error occured');
      throw error;
  }
}



function onListening() {
  
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  ('Listening on ' + bind);
  let db = mongoose.connect(appConfig.db.uri,{ useNewUrlParser: true });
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});


//databse coon here
mongoose.connection.on('error', function (err) {
  console.log('database connection error');
  console.log(err)
  //process.exit(1)
}); 

mongoose.connection.on('open', function (err) {
  if (err) {
    console.log("database error");
    console.log(err);
  } else {
    console.log("database connection open success");
    
  }
}); 






module.exports = app;