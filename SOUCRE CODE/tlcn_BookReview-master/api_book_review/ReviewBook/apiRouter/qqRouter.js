var firebase = require("firebase");
var express = require("express");
var Qq = require("./../model/qq");

const qqRouter = express.Router();
qqRouter
    .route("/qq/:id_quiz/:id_ques")
    .post((req, res) => {
        var id_quiz = req.params.id_quiz;
        var id_ques = req.params.id_ques
        var qq = new Qq(id_quiz, id_ques)
        dbqRef = firebase
            .database()
            .ref()
            .child("qq")
        newqqRef = dbqRef.push();
        newqqRef
            .set(qq, function (error) {
                if (error) {
                    var errorMessage = error.message;
                    res.send(errorMessage);
                } else {
                    dbQuiz = firebase
                        .database()
                        .ref()
                        .child("Quiz")
                        .child(id_quiz)
                        .child("question");
                    var key = id_ques;
                    dbQuiz.update({ [key]: true }, error => {
                        if (error) {
                            var errorMessage = error.message;
                            res.send(errorMessage);
                        } else {
                            dbQues = firebase
                                .database()
                                .ref()
                                .child("Questions")
                                .child(id_ques)
                                .child("quiz");
                            var key = id_quiz;
                            dbQues.update({ [key]: true }, error => {
                                if (error) {
                                    var errorMessage = error.message;
                                    res.send(errorMessage);
                                } else {
                                    res.send({
                                        success: true,
                                        message: "post ques in quiz successfully"
                                    });
                                }
                            });
                        }
                    });

                }

            }
            );

    })
    //xoa cau hoi khoi bai post
    .delete((req, res) => {
        var id_quiz = req.params.id_quiz
        var id_ques = req.params.id_ques
        var qqRef = firebase
            .database()
            .ref()
            .child("qq")
        qqRef.remove().then(error => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            } else {
                var dbQuiz = firebase
                    .database()
                    .ref()
                    .child("Quiz")
                    .child(id_quiz);
                dbQuiz.child('question').child(id_ques).remove()
                    .then(error => {
                        if (error) {
                            res.send({
                                success: false,
                                message: error.message
                            })
                        } else {
                            var dbQues = firebase
                                .database()
                                .ref()
                                .child("Questions")
                                .child(id_ques);
                            dbQues.child('quiz').child(id_quiz).remove()
                                .then(error => {
                                    if (error) {
                                        res.send({
                                            success: false,
                                            message: error.message
                                        })
                                    } else {
                                        res.send({
                                            success: true,
                                            message: "ques in quiz deleted successfully"
                                        });
                                    }
                                })

                        }
                    })
            }
        })
    })

qqRouter
    .route("/qq/:id_quiz")
    //tra ve tat ca ques của quiz
    .get((req, res) => {
        var result = [];
        var id_quiz = req.params.id_quiz;
        dbQuesRef = firebase
            .database()
            .ref()
            .child("Questions")
        dbQuizRef = firebase
            .database()
            .ref()
            .child("Quiz")
            .child(id_quiz)
            .child('question')
        dbQuizRef.once('value', snapshot => {
            if (snapshot.exists()) {
                var key = Object.keys(snapshot.val());
                for (let i = 0; i < key.length; i++) {
                    dbQuesRef
                        .child(key[i])
                        .on('value', snaps => {
                            if (snaps.exists()) {
                                var obj = {};
                                obj[key[i]] = snaps.val();
                                result.unshift(obj)
                                console.log(result)
                                if (i === key.length - 1) {
                                    res.send(result)
                                }

                            }
                            else {
                                res.send({
                                    success: false,
                                    message: "no exists"
                                })
                            }
                        })
                }
                // var dbQuesRef = firebase
                // .database()
                // .ref()
                // .child("Questions")
                // .child(key)
                // dbQuesRef.once('value',ques=>{
                //     if(ques.exists()){
                //         res.send(ques.val());

                //     }else{
                //         res.send({
                //             success:false,
                //             message:"no exists"
                //           })
                //     }
                // })
            } else {
                res.send({
                    success: false,
                    message: "no exists"
                })
            }
        })
        // const quesinquiz = dbQuizRef.map(id => {
        //     return dbQuesRef.child(id).on('value', s => s)
        // })
        // Promise.all(quesinquiz)
        //     .then(snapshot => {
        //         // chúng ta sẽ làm việc tại đây.
        //         res.send(snapshot.val());
        //     })
        //     .catch(err => {
        //         res.send(err.message);
        //         // handle error
        //     })
    })


module.exports = qqRouter;


