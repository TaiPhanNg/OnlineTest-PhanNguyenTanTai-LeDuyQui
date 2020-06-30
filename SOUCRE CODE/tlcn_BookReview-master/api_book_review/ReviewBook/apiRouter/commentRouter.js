var firebase = require("firebase");
var express = require("express");
var Comment = require("./../model/comment");

const commentRouter = express.Router();
commentRouter
  .route("/review/comment/:review_id")
  //luu 1 comment cua user vao co so du lieu
  .post((req, res) => {
    var body = req.body.body;
    var user = req.decoded.user;
    var imageUser = user.image;
    var nameUser = user.firstName + ' ' + user.secondName;
    var review_id = req.params.review_id;

    var userID = req.decoded.userID;
    var comment = new Comment(userID, body, imageUser, nameUser);
    dbCommentRef = firebase
      .database()
      .ref()
      .child("Comments")
      .child(review_id);
    newCommentRef = dbCommentRef.push();
    newCommentRef.set(comment, error => {
      if (error) {
        var errorMessage = error.message;
        res.send(errorMessage);
      } else {
        dbReview = firebase
          .database()
          .ref()
          .child("Reviews")
          .child(review_id)
          .child("comments");
        var key = newCommentRef.key;
        dbReview.update({ [key]: true }, error => {
          if (error) {
            var errorMessage = error.message;
            res.send(errorMessage);
          } else {
            res.send({
              success: true,
              message: "Commented successfully"
            });
          }
        });
      }
    });
  })
  // TRẢ VỀ TẤT CẢ COMMMENT CỦA BÀI VIẾT
  .get((req,res)=>{
    var review_id = req.params.review_id;
    var a =[];
    dbCommentRef = firebase
    .database()
    .ref()
    .child("Comments")
    .child(review_id);
    dbCommentRef.once('value',snapshot=>{
      
      if(snapshot.exists()){
        var key = Object.keys(snapshot.val());
        
        for(let i =0; i<key.length;i++)
        {
          
          dbcmt =firebase
          .database()
          .ref()
          .child("Comments")
          .child(review_id)
          .child(key[i])
          .on('value', snaps =>{
            
            //console.log(snaps.val())
            var obj ={};
            obj[key[i]]= snaps.val();
            a.unshift(obj)
            console.log(a);
            if(i === key.length-1)
            {
              res.send(a)
            }
          })
          
          
        }
        console.log(key)
        
      
       
      }else{
        res.send({
          success:false,
          message:"no exists"
        })
      }
    })
  })
  .put((req,res)=>{
    var review_id = req.params.review_id;
    var id_comment = req.body.id_comment;
    var body = req.body.body;
    var userID = req.decoded.userID;
    commentRef = firebase.database().ref().child("Comments").child(review_id).child(id_comment);
    commentRef.once('value',snapshot=>{
      if(snapshot.exists()){
        var comment = new Comment(
          snapshot.val().id_user,
          body,
          snapshot.val().imageUser,
          snapshot.val().nameUser,  
        );
        if(userID === comment.id_user){
          commentRef.update(comment,error=>{
            if (error) {
              var errorMessage = error.message;
              res.send(errorMessage);
            } else {
              res.send({
                success: true,
                message: "edited successfully"
              });
            }
          })
        }else{
          res.send({
            success: true,
            message: "can't edit"
          });
        }
      }else{
        res.send({
          success:false,
          message:"no exists"
        })
      }
    })
  })
  .delete((req,res)=>{
    var review_id = req.params.review_id;
    var id_comment = req.body.id_comment;
  
    var commentRef = firebase.database().ref().child('Comments').child(review_id).child(id_comment);
    commentRef.remove().then(error=>{
      if (error) {
        res.send({
            success:false,
            message:error.message
        })
    } else {
        var reviewRef = firebase.database().ref().child('Reviews').child(review_id);
        reviewRef.child('comments').child(id_comment).remove().then(error=>{
          if (error) {
            res.send({
                success:false,
                message:error.message
            })
          } else {
            res.send({
              success: true,
              message: "comment deleted successfully"
            });
          }
        })
      }
    })
  })

module.exports = commentRouter;
