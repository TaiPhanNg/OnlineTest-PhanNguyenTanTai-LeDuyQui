var firebase = require("firebase");
var express = require("express");
var Review = require("./../model/review");

const reviewRouter = express.Router();
reviewRouter
  .route("/review/post")
  //dang 1 bai viet
  .post((req, res) => {
    var nameDB = "ApproveReviews";
    var user = req.decoded.user;
    user.role === "admin" ? (nameDB = "Reviews") : nameDB;

    var databaseRef = firebase
      .database()
      .ref()
      .child(nameDB);
    databaseRef.once("value").then(function(snapshot) {
      var nameImage = req.body.nameImage;
      var desc = req.body.desc;
      var url = req.body.url;
      var kind = req.body.kind;

      var userID = req.decoded.userID;
      var fName = user.firstName;
      var sName = user.secondName;
      var userName = fName + " " + sName;
      var reviewData = new Review(
        kind,
        url,
        nameImage,
        desc,
        userID,
        userName,
        user.image
      );

      var newPostReviewRef = databaseRef.push();

      newPostReviewRef
        .set(reviewData, function(error) {
          if (error) {
            var errorMessage = error.message;
            res.send(errorMessage);
          } else {
            res.send({
              success: true,
              message: "post review successful"
            });
          }
        })
        .catch(error => {
          res.send(error.message);
        });
    });
  })
  //tra ve danh sach 10 bai viet cuoi cung
  .get((req, res) => {
    var dbReviews = firebase
      .database()
      .ref()
      .child("Reviews")
      .orderByChild("numberTime")
      .limitToLast(10);
    dbReviews.once("value", reviews => {
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
  });

reviewRouter
  .route("/review/post/:numberTime")
  //trả về 10 bài viết tiếp theo
  .get((req, res) => {
    var dbReviews = firebase
      .database()
      .ref()
      .child("Reviews")
      .orderByChild("numberTime")
      .endAt(Number(req.params.numberTime))
      .limitToLast(11);
    dbReviews.once("value", reviews => {
      var result = [];
      if (reviews.exists()) {
        reviews.forEach(child => {
          var obj = {};
          obj[child.key] = child.val();
          result.unshift(obj);
        });
        result.shift();
        res.send(result);
      } else {
        res.send({
          success: false
        });
      }
    });
  });

reviewRouter
  .route("/review/post/own/:id_user")
  //tra ve danh sach bai review cua tai khoan dang dang nhap sap xep theo thoi gian moi nhat
  .get((req, res) => {
    var userID = req.params.id_user;
    var dbReviews = firebase
      .database()
      .ref()
      .child("Reviews")
      .orderByChild("uid")
      .equalTo(userID);
    dbReviews.once("value", function(reviews) {
      var result = [];
      if (reviews.exists) {
        reviews.forEach(child => {
          var obj = {};
          obj[child.key] = child;
          result.unshift(obj);
        });
        res.send(result);
      } else {
        res.send({
          success: false
        });
      }
    });
  });

reviewRouter
  .route("/review/post/own/:id_user/:review_id")
  //tra ve bai viet theo id
  .get((req, res) => {
    var userID = req.params.id_user;
    var dbReviews = firebase
      .database()
      .ref()
      .child("Reviews")
      .child(req.params.review_id);
    dbReviews.once("value", function(reviews) {
      if (reviews.val().uid === userID) {
        res.send(reviews.val());
      } else {
        res.send({
          success: false,
          message: "Not your review"
        });
      }
    });
  })
  //update bai viet theo id
  .put((req, res) => {
    var nameDB = "ApproveReviews";
    var user = req.decoded.user;
    user.role === "admin" ? (nameDB = "Reviews") : nameDB;

    var userID = req.params.id_user;
    var dbReviews = firebase
      .database()
      .ref()
      .child("Reviews")
      .child(req.params.review_id);
    dbReviews.once("value", function(reviews) {
      if (reviews.val().uid === userID) {
        var review = new Review();
        review = reviews.val();
        if (req.body.kind) {
          review.kind = req.body.kind;
        }
        if (req.body.url) {
          review.urlImage = req.body.url;
        }
        if (req.body.desc) {
          review.desc = req.body.desc;
        }
        if (req.body.nameImage) {
          //delete file upload

          var reviewStorageRef = firebase
            .storage()
            .ref()
            .child("Review Images")
            .child(review.nameImage);
          reviewStorageRef
            .delete()
            .then()
            .catch(error => {
              res.send({
                success: false,
                message: error.message
              });
            });
          review.nameImage = req.body.nameImage;
        }

        firebase
          .database()
          .ref()
          .child(nameDB)
          .child(dbReviews.key)
          .set(review, error => {
            if (error) {
              var errorMessage = error.message;
              res.send(errorMessage);
            } else {
              if (user.role !== "admin") {
                dbReviews.remove();
              }
              res.send({
                success: true,
                review: review,
                message: "Update review successful"
              });
            }
          });
      } else {
        res.send({
          success: false,
          message: "Not your review"
        });
      }
    });
  })
  .delete((req, res) => {
    var dbReviews = firebase
      .database()
      .ref()
      .child("Reviews")
      .child(req.params.review_id);
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
            .child(req.params.review_id)
            .remove();
          firebase
            .database()
            .ref()
            .child("Comments")
            .child(req.params.review_id)
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

module.exports = reviewRouter;
