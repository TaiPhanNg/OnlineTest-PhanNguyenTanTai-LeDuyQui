var firebase = require("firebase");
var express = require("express");
var Quiz = require("./../model/quiz");
const quizRouter = express.Router();
quizRouter
    .route("/quiz/post")
    .post((req, res) => {
        var nameDB = "Quiz";
        var user = req.decoded.user;
        user.role === "admin" ? (nameDB = "Quiz") : nameDB;
        var databaseRef = firebase
            .database()
            .ref()
            .child(nameDB);
        databaseRef.once("value").then(function (snapshot) {
            var kind = req.body.kind;
            var dateStart = req.body.dateStart;
            var role = req.body.role;
            var active = req.body.active;
            var quizData = new Quiz(
                kind,
                dateStart,
                active,
                role
            );
            var newPostQuizRef = databaseRef.push();
            newPostQuizRef
                .set(quizData, function (error) {
                    if (error) {
                        var errorMessage = error.message;
                        res.send(errorMessage);
                    } else {
                        res.send({
                            success: true,
                            message: "post quiz successful"
                        })
                    }

                }
                )
                .catch(error => {
                    res.send(error.message);
                });
        });
    })
    .get((req, res) => {
        var dbReviews = firebase
            .database()
            .ref()
            .child("Quiz")
            .orderByChild("numberTime")
            .limitToLast(10);
        dbReviews.once("value", quiz => {
            var result = [];
            if (quiz.exists()) {
                quiz.forEach(child => {
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
quizRouter
    .route("/quiz/post/:numberTime")
    //trả về 10 bài viết tiếp theo
    .get((req, res) => {
        var dbReviews = firebase
            .database()
            .ref()
            .child("Quiz")
            .orderByChild("numberTime")
            .endAt(Number(req.params.numberTime))
            .limitToLast(11);
        dbReviews.once("value", quiz => {
            var result = [];
            if (quiz.exists()) {
                quiz.forEach(child => {
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
quizRouter
    .route("/quiz/:id_quiz")
    .get((req, res) => {
        var quizID = req.params.id_quiz;
        questionRef = firebase
            .database()
            .ref()
            .child("Quiz")
            .child(req.params.id_quiz)
        questionRef.once("value", snapshot => {
            if (snapshot.exists()) {
                res.send(snapshot.val());
            } else {
                res.send({
                    success: false,
                    message: "no exists"
                });
            }
        })
    })
    .put((req, res) => {
        var nameDB = "Quiz";
        var user = req.decoded.user;
        user.role === "admin" ? (nameDB = "Quiz") : nameDB;
        var dbReviews = firebase
            .database()
            .ref()
            .child("Quiz")
            .child(req.params.id_quiz);
        dbReviews.once("value", function (questions) {
            var question = new Quiz();
            question = question.val();
            if (req.body.content) {
                question.kind = req.body.kind;
            }
            if (req.body.active) {
                question.active = req.body.active;

            }
            if (req.body.role) {
                question.role = req.body.role;
            }
            if (req.body.dateStart) {
                question.dateStart = req.body.dateStart;
            }
            
            firebase
                .database()
                .ref()
                .child(nameDB)
                .child(dbReviews.key)
                .set(question, error => {
                    if (error) {
                        var errorMessage = error.message;
                        res.send(errorMessage);
                    } else {
                        if (user.role !== "admin") {
                            dbReviews.remove();
                        }
                        res.send({
                            success: true,
                            question: question,
                            message: "Update quiz successful"
                        });
                    }
                });
        });

    })
    .delete((req, res) => {
        var dbReviews = firebase
            .database()
            .ref()
            .child("Quiz")
            .child(req.params.id_quiz);
        dbReviews.once("value", function (questions) {
            dbReviews.remove().then(error => {
                if (error) {
                    res.send({
                        success: false,
                        message: error.message
                    });
                } else {
                    res.send({
                        success: true,
                        message: "Delete quiz successful"
                    });


                }

            })
        });
    });
    quizRouter
    .route('/allquiz')
.get((req,res)=>{
  
    var reviewRef = firebase
      .database()
      .ref()
      .child("Quiz")
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
 
})

module.exports = quizRouter;