var firebase = require("firebase");
var express = require("express");

const searchRouter = express.Router();
searchRouter.route("/review/search").post((req, res) => {
  var search = new RegExp(req.body.query,"gi");
  var dbReviews = firebase
    .database()
    .ref()
    .child("Reviews");
  dbReviews.once("value", reviews => {
    var result = [];
    if (reviews.exists()) {
      reviews.forEach(child => {
        var str = child.val().name + child.val().desc +'';
        if (str.match(search)) {
          var obj = {};
          obj[child.key] = child.val();
          result.unshift(obj);
        }
      });
      
      res.send(result);
    } else {
      res.send({
        success: false
      });
    }
  });
});

module.exports = searchRouter;
