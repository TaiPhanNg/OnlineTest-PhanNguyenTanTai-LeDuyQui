var express = require("express"); //	call express
var app = express(); //	define our app usỉng express
var bodyParser = require("body-parser"); //	get body-parser
var firebase = require("firebase");
var admin = require('firebase-admin')
require('firebase/storage');
var morgan = require("morgan"); //	used to see requests
var port = process.env.PORT || 8080; // set the port for our app

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT"); 
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,	Authorization"
  );
  next();
});
 
app.use(morgan("dev"));

app.listen(port);
console.log("Port can dung la: " + port);

var firebaseConfig = {
  apiKey: "AIzaSyAxsPNM6aufE4GYrx4Ia4C8GrzI4mAPX9g",
  authDomain: "reviewbook-1af0f.firebaseapp.com",
  databaseURL: "https://reviewbook-1af0f.firebaseio.com",
  projectId: "reviewbook-1af0f",
  storageBucket: "reviewbook-1af0f.appspot.com",
  messagingSenderId: "357029016894",
  appId: "1:357029016894:web:95d3d1711b442cbfc5286f",
  measurementId: "G-GP50EN1R49"
};
firebase.initializeApp(firebaseConfig);
var serviceAccount = require('./serviceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reviewbook-1af0f.firebaseio.com"
});
firebase.auth.Auth.Persistence.LOCAL;

var loginRouter = require("./apiRouter/loginRouter");
app.use("/reviewbook", loginRouter);
var reviewRouter = require("./apiRouter/reviewRouter");
app.use("/reviewbook", reviewRouter);
var likeRouter = require("./apiRouter/likeRouter");
app.use("/reviewbook", likeRouter);
var commentRouter = require("./apiRouter/commentRouter");
app.use("/reviewbook", commentRouter);
var userRouter = require("./apiRouter/userRouter");
app.use("/reviewbook", userRouter);
var searchRouter = require("./apiRouter/searchRouter");
app.use("/reviewbook", searchRouter);
var chatRouter = require("./apiRouter/chatRouter");
app.use("/reviewbook", chatRouter);
var approveRouter = require("./apiRouter/approveRouter");
app.use("/reviewbook", approveRouter);
var questionRouter =require("./apiRouter/questionRouter");
app.use("/reviewbook", questionRouter);
var quizRouter =require("./apiRouter/quizRouter");
app.use("/reviewbook", quizRouter);
var qqRouter =require("./apiRouter/qqRouter");
app.use("/reviewbook", qqRouter);
var premierRouter =require("./apiRouter/premierRouter");
app.use("/reviewbook", premierRouter);
