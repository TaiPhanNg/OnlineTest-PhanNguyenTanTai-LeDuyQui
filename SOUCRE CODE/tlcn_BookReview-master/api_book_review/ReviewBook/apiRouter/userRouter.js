var firebase = require("firebase");
var admin = require("firebase-admin");
var express = require("express");
var User = require("./../model/user");

const userRouter = express.Router();

userRouter.route("/users").get((req, res) => {
  firebase
    .database()
    .ref()
    .child("Users")
    .once("value", snapshot => {
      res.send(snapshot.val());
    });
});

userRouter
  .route("/user/:id_user")
  .get((req, res) => {
    var userID = req.params.id_user;
    userRef = firebase
      .database()
      .ref()
      .child("Users")
      .child(userID);
    userRef.once("value", snapshot => {
      res.send(snapshot.val());
    });
  })
  .put((req, res) => {
    var userID = req.params.id_user;
    var userRef = firebase
      .database()
      .ref()
      .child("Users")
      .child(userID);
    userRef.once("value", snapshot => {
      var user = new User();
      user = snapshot.val();

      if (req.body.fName && req.body.fName.length > 0) {
        user.firstName = req.body.fName;
      }
      if (req.body.sName && req.body.sName.length > 0) {
        user.secondName = req.body.sName;
      }
      if (req.body.gender && req.body.gender.length > 0) {
        user.gender = req.body.gender;
      }
      if (req.body.phone && req.body.phone.length > 0) {
        user.phone = req.body.phone;
      }
      if (req.body.birthday && req.body.birthday.length > 0) {
        user.birthday = req.body.birthday;
      }
      if (req.body.image && req.body.image.length > 0) {
        user.image = req.body.image;
      }

      req.decoded.user = user;
    
      //update review
      var reviewRef = firebase.database().ref().child('Reviews');
      reviewRef.orderByChild('uid').equalTo(req.decoded.userID).once('value',reviews=>{
          if(reviews.exists()){
              reviews.forEach(x => {
                  var review = x.val();
                  review.name = user.firstName + " " + user.secondName;                
                  review.urlUser = user.image;  
                  console.log(x.key);
                           
                  reviewRef.child(x.key).update(review);
              });
          }
      })

      //update approve
      var approveRef = firebase.database().ref().child('ApproveReviews');
      approveRef.orderByChild('uid').equalTo(req.decoded.userID).once('value',reviews=>{
          if(reviews.exists()){
              reviews.forEach(x => {
                  var review = x.val();
                  review.name = user.firstName + " " + user.secondName;                
                  review.urlUser = user.image;           
                  approveRef.child(x.key).update(review);
              });
          }
      })


      userRef.update(user, error => {
        if (error) {
          res.send({
            success: false,
            message: error.message
          });
        } else {
          res.send({
            success: true,
            user: req.decoded
          });
        }
      });  
    });
  });

userRouter.route("/user/lock/:id_user").post((req, res) => {
  var lock = Boolean(req.body.lock);
  admin
    .auth()
    .updateUser(req.params.id_user, { disabled: lock })
    .then(() => {
      firebase
        .database()
        .ref()
        .child("Users")
        .child(req.params.id_user)
        .child("lock")
        .set(lock, error => {
            if (error) {
                res.send({
                  success: false,
                  message: error.message
                });
              } else {
                res.send({
                  success: true,
                  user: "lock successful"
                });
              }
        });
    })
    .catch(error => console.log("Error auto blocking:", error));
});
userRouter.route("/user/premier/:id_user").post((req, res) => {
  var premier = Boolean(req.body.premier);
  
  // admin
  //   .auth()
  //   .updateUser(req.params.id_user, { disabled: premier })
      console.log(premier)
      dbUser=
      firebase
        .database()
        .ref()
        .child("Users")
        .child(req.params.id_user)
        dbUser.update({['premier']:premier},error=>
         {
            if (error) {
                res.send({
                  success: false,
                  message: error.message
                });
              } else {
                res.send({
                  success: true,
                  user: "premier ok successful"
                });
              }
        });
        
    
    // .catch(error => console.log("Error auto blocking:", error));
});
module.exports = userRouter;
