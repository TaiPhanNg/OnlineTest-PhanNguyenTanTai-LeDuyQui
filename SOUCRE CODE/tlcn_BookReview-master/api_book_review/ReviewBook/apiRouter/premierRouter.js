var firebase = require("firebase");
var express = require("express");
var premierList = require("./../model/premierlist");
const premierRouter = express.Router();
premierRouter
    .route("/premier/:id_user")
    .post((req, res) => {
      var uid =req.params.id_user
        
        var plist = new premierList(uid)
        dbqRef = firebase
            .database()
            .ref()
            .child("premier")
        newqqRef = dbqRef.push();
        var key =uid;
        dbqRef.update({[key]:true}, error => {
            if (error) {
                var errorMessage = error.message;
                res.send(errorMessage);
            }else{
                res.send({
                    success: true,
                    message: "post prmier in quiz successfully"
                });
            }
        }
      
    )})
   premierRouter
   .route("/premier")
   .get((req,res)=>{
       var result=[]
       dbPrRef =firebase
       .database()
       .ref()
       .child('premier')
      dbPrRef.once("value", reviews => {
        var result = [];
        if (reviews.exists()) {
            var key =Object.keys(reviews.val())
            console.log(key)
          
          res.send(key);
        } else {
          res.send({
            success: false
          });
        }
      });
   })
module.exports = premierRouter;