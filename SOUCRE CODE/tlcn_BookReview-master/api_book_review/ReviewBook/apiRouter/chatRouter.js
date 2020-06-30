var firebase = require("firebase");
var express = require("express");
var Chat = require("./../model/chat");

const chatRouter = express.Router();
chatRouter.route('/chat')
.post((req,res)=>{
    var body = req.body.body;
    var user = req.decoded.user;
    var nameUser = user.firstName + " " + user.secondName;
    var imageUser = user.image;
    var userIDSend = req.body.userIDSend;
    var userIDRReceive = req.body.userIDRReceive;
    var key;
    userIDSend > userIDRReceive? (key = userIDSend + userIDRReceive) : ( key = userIDRReceive + userIDSend);
    var chat  = new Chat(userIDSend,body,imageUser,nameUser);
    var chatRef = firebase.database().ref().child('Chats').child(key).push();
    chatRef.set(chat,error=>{
        if(error){
            res.send({
                success:false,
                error:error.message
            })
        }else{
            res.send({
                success:true,
                message:"chat successful"
            })
        }
    })
})
chatRouter.route('/chat/:userIDSend/:userIDRReceive')
.get((req,res)=>{
    var userIDSend = req.params.userIDSend;
    var userIDRReceive = req.params.userIDRReceive;
    var key;
    userIDSend > userIDRReceive? (key = userIDSend + userIDRReceive) : ( key = userIDRReceive + userIDSend);
    firebase.database().ref().child('Chats').child(key).once("value",snapshot=>{
        if(snapshot.exists()){
            res.send(snapshot.val());
        }else{
            res.send(false);
        }
    })
})

module.exports = chatRouter;