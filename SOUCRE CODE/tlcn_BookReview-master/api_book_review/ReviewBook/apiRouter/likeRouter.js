var firebase = require("firebase");
var express = require("express");
var Like = require('./../model/like');

const likeRouter = express.Router();
likeRouter.route("/review/like/:review_id")
//tra ve danh sach nguoi thich bai review
.get((req,res)=>{
    dbLike = firebase.database().ref().child('Likes').child(req.params.review_id);
    dbLike.once('value',likes=>{
        if(likes.exists()){
         var result = [];
         likes.forEach(like => {
             var obj = {};
             obj[like.key] = like;
             result.unshift(obj);
         });
         res.send(result);
        }else{
            res.send({
                success:false,
                message:"Nobody likes the post"
            })
        }
    })
})
//luu nguoi thich bai viet len db
.post((req,res)=>{
    var user = req.decoded.user;
    var imageUser = user.image;
    var nameUser = user.firstName + ' ' + user.secondName;
    var review_id = req.params.review_id;
    var like = new Like(imageUser,nameUser);
    
    var userID = req.decoded.userID;
    var dblike = firebase.database().ref().child('Likes').child(review_id).child(userID);
    dblike.once('value',snapshot=>{
        if(snapshot.exists()){
            // XỬ LÝ DISLIKE
            dblike.remove().then(error=>{
                if(error){
                  res.send({
                    success:false,
                    message:error.message
                  })
                }else{
                    var dbReviewLike = firebase.database().ref().child('Reviews').child(review_id).child('likes').child(userID);
                    dbReviewLike.remove().then(error=>{
                        if (error) {
                            res.send({
                                success:false,
                                message:error.message
                            })
                        } else {
                            res.send({
                              success: true,
                              message: "disliked successful"
                            });
                        }
                    })
                }
            });
        }else{
            //XỬ LÝ LIKE
            dblike.set(like,error=>{
                if(error){
                    res.send({
                        success:false,
                        message:error.message
                    })
                }else{
                    var dbReview = firebase.database().ref().child('Reviews').child(review_id).child('likes');
                    dbReview.update({[userID]:nameUser},error=>{
                        if (error) {
                            res.send({
                                success:false,
                                message:error.message
                            })
                          } else {
                            res.send({
                              success: true,
                              message: "liked successful"
                            });
                          }
                    })
                }
            })
        }
    })
})

module.exports = likeRouter;    