var firebase = require("firebase");
var express = require("express");
var nodemailer = require("nodemailer");
var Review = require("./../model/review");

const approveRouter = express.Router();
approveRouter.route("/approvereviews").get((req, res) => {
  var user = req.decoded.user;
  if (user.role === "admin") {
    var approveRef = firebase
      .database()
      .ref()
      .child("ApproveReviews")
      .orderByChild("numberTime");
    approveRef.once("value", reviews => {
      var result = [];
      if (reviews.exists()) {
        reviews.forEach(child => {
          var obj = {};
          obj[child.key] = child.val();
          result.unshift(obj);
        });
        res.send(result);
      } else {
        res.send({
          success: false
        });
      }
    });
  } else {
    res.send({
      success: false,
      message: "You are not the admin"
    });
  }
});

approveRouter.route('/allreivew')
.get((req,res)=>{
  var user = req.decoded.user;
  if (user.role === "admin") {
    var reviewRef = firebase
      .database()
      .ref()
      .child("Reviews")
      .orderByChild("numberTime");
    reviewRef.once("value", reviews => {
      var result = [];
      if (reviews.exists()) {
        reviews.forEach(child => {
          var obj = {};
          obj[child.key] = child.val();
          result.unshift(obj);
        });
        res.send(result);
      } else {
        res.send({
          success: false
        });
      }
    });
  } else {
    res.send({
      success: false,
      message: "You are not the admin"
    });
  }
})

approveRouter.route("/approvereviews/:id_review").post((req, res) => {
  var user = req.decoded.user;
  if (user.role === "admin") {
    var id_review = req.params.id_review;
    var approveRef = firebase
      .database()
      .ref()
      .child("ApproveReviews")
      .child(id_review);
    approveRef.once("value", snapshot => {
      if (snapshot.exists()) {
        var reviewRef = firebase
          .database()
          .ref()
          .child("Reviews")
          .child(id_review);
        reviewRef.set(snapshot.val(), error => {
          if (error) {
            res.send({
              success: false,
              message: error.message
            });
          } else {
            //send mail
            firebase.database().ref().child("Users").child(snapshot.val().uid).once('value',userPost=>{
              sendMail(userPost.val(),snapshot.val());
            })
            approveRef.remove();
            res.send({
              success: true,
              message: "approved review"
            });
          }
        });
      } else {
        res.send({
          success: false,
          message: "reviews no exists"
        });
      }
    });
  } else {
    res.send({
      success: false,
      message: "You are not the admin"
    });
  }
})
.delete((req, res) => {
  var dbReviews = firebase
    .database()
    .ref()
    .child("ApproveReviews")
    .child(req.params.id_review);
  dbReviews.once("value", function(reviews) {
    dbReviews.remove().then(error => {
      if (error) {
        res.send({
          success: false,
          message: error.message
        });
      } else {
        firebase
          .database()
          .ref()
          .child("Likes")
          .child(req.params.id_review)
          .remove();
        firebase
          .database()
          .ref()
          .child("Comments")
          .child(req.params.id_review)
          .remove();

        if (reviews.val().nameImage) {
          var reviewStorageRef = firebase
            .storage()
            .ref()
            .child("Review Images")
            .child(reviews.val().nameImage);
          reviewStorageRef.delete().then(() => {
            res.send({
              success: true,
              message: "Delete review successful"
            });
          });
        } else {
          res.send({
            success: true,
            message: "Delete review successful"
          });
        }
      }
    });
  });
});
;

var sendMail = (user,review) => {
  
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "reviewbooktlcn@gmail.com",
      pass: "reviewbook1998"
    }
  });

  var mailOptions = {
    from: "Reviewbook",
    to: user.email,
    subject: "Confirm Post Review",
    html: `
          <h1>Hi ${user.firstName +" "+ user.secondName}</h1>
          Your review is as follows: <b>${review.desc}</b><div>
            <img src=${review.urlImage} alt="Smiley face" height="300" width="300"> 
          </div>
          <div>
          posted on : ${review.time} <b>has been approved by admin</b>
          </div>
          `
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = approveRouter;
