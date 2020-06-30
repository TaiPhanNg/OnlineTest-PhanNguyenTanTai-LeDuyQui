var firebase = require("firebase");
var admin = require("firebase-admin");
var express = require("express");
var Question = require("./../model/question");
const e = require("express");
const questionRouter = express.Router();

questionRouter
    .route("/question/post")
    .post((req, res) => {
        var nameDB = "Questions";
        var user = req.decoded.user;
        user.role === "admin" ? (nameDB = "Questions") : nameDB;
        var databaseRef = firebase
            .database()
            .ref()
            .child(nameDB);
        databaseRef.once("value").then(function (snapshot) {
            var cont = req.body.cont;
            var part = req.body.part;
            var option = req.body.option;
            var image = req.body.image;
            var audio = req.body.audio;
            var urlImage = req.body.urlImage;
            var urlAudio = req.body.urlAudio;
            var questionData = new Question(
                cont,
                part,
                option,
                image,
                urlImage,
                audio,
                urlAudio,
            );

            var newQuestionRef = databaseRef.push();
            var a = {}
            a = option
            console.log(a)
            newQuestionRef
                .set(questionData, function (error) {
                    if (error) {
                        var errorMessage = error.message;
                        res.send(errorMessage);
                    }
                    else {
                        res.send({
                            success: true,
                            message: "question review successful"
                        });
                    }
                })
                .catch(error => {
                    res.send(error.message);
                });
        });
    })
    //tra ve danh sach 10 cauhoi cuoi cung
    .get((req, res) => {
        var dbReviews = firebase
            .database()
            .ref()
            .child("Questions")
            .orderByChild("numberTime")
            .limitToLast(10);
        dbReviews.once("value", questions => {
            var result = [];
            if (questions.exists()) {
                questions.forEach(child => {
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
questionRouter
    .route("/question/post/:numberTime")
    //tra ve 10 cau hoi tiep theo
    .get((req, res) => {
        var dbReviews = firebase
            .database()
            .ref()
            .child("Questions")
            .orderByChild("numberTime")
            .endAt(Number(req.params.numberTime))
            .limitToLast(11);
        dbReviews.once("value", questions => {
            var result = [];
            if (questions.exists()) {
                questions.forEach(child => {
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
    })
questionRouter
    .route("/question/:id_question")
    //tra ve cau hoi theo id
    .get((req, res) => {
        var questionID = req.params.id_question;
        questionRef = firebase
            .database()
            .ref()
            .child("Questions")
            .child(req.params.id_question)
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
        var nameDB = "ApproveQuestions";
        var user = req.decoded.user;
        user.role === "admin" ? (nameDB = "Questions") : nameDB;
        var dbReviews = firebase
            .database()
            .ref()
            .child("Questions")
            .child(req.params.id_question);
        dbReviews.once("value", function (questions) {
            var question = new Question();
            question = question.val();
            if (req.body.cont) {
                question.cont = req.body.cont;
            }
            if (req.body.part) {
                question.part = req.body.part;

            }
            if (req.body.option) {
                question.option = req.body.option;
            }
            if (req.body.urlImage) {
                question.urlImage = req.body.urlImage
            }
            if (req.body.urlAudio) {
                question.urlAudio = req.body.urlAudio
            }
            if (req.body.image) {
                var reviewStorageRef = firebase
                    .storage()
                    .ref()
                    .child("Question Images")
                    .child(question.image);
                reviewStorageRef
                    .delete()
                    .then()
                    .catch(error => {
                        res.send({
                            success: false,
                            message: error.message
                        });
                    });
                question.image = req.body.image;
            }
            if (req.body.audio) {
                var reviewStorageRef = firebase
                    .storage()
                    .ref()
                    .child("Question Audio")
                    .child(question.audio);
                reviewStorageRef
                    .delete()
                    .then()
                    .catch(error => {
                        res.send({
                            success: false,
                            message: error.message
                        });
                    });
                question.audio = req.body.audio;
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
                            message: "Update review successful"
                        });
                    }
                });
        });

    })
    .delete((req, res) => {
        var dbReviews = firebase
            .database()
            .ref()
            .child("Questions")
            .child(req.params.id_question);
        dbReviews.once("value", function (questions) {
            dbReviews.remove().then(error => {
                if (error) {
                    res.send({
                        success: false,
                        message: error.message
                    });
                } else {
                    if (questions) {
                        if (questions.val().image) {
                            var reviewStorageRef = firebase
                                .storage()
                                .ref()
                                .child("Question Images")
                                .child(questions.val().image);
                            reviewStorageRef.delete().then(() => {
                                if (questions.val().audio) {
                                    var reviewStorageRef = firebase
                                        .storage()
                                        .ref()
                                        .child("Question Audio")
                                        .child(questions.val().audio);
                                    reviewStorageRef.delete().then(() => {
                                        res.send({
                                            success: true,
                                            message: "Delete question successful"
                                        });
                                    });
                                } else{
                                    res.send({
                                        success: true,
                                        message: "Delete question successful"
                                    });
                                }
                              
                            });
                        }
                        else 
                        if (questions.val().audio && !questions.val().image) {
                            var reviewStorageRef = firebase
                                .storage()
                                .ref()
                                .child("Question Audio")
                                .child(questions.val().audio);
                            reviewStorageRef.delete().then(() => {
                                
                               
                                    res.send({
                                        success: true,
                                        message: "Delete question successful"
                                    });
                                
                            });
                        }
                    }
                    else {
                        res.send({
                            success: true,
                            message: "Delete review successful"
                        });
                    }
                }
            });
        });
    });
questionRouter
    .route('/allques')
    .get((req, res) => {
        var user = req.decoded.user;
        if (user.role === "admin") {
            var reviewRef = firebase
                .database()
                .ref()
                .child("Questions")
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
module.exports = questionRouter;