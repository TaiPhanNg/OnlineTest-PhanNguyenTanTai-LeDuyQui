import firebase from "firebase";
import "firebase/storage";
import { setQues } from "../actions/posts/setQues";
import { useDispatch } from "react-redux";

var firebaseConfig = {
  apiKey: "AIzaSyAxsPNM6aufE4GYrx4Ia4C8GrzI4mAPX9g",
  authDomain: "reviewbook-1af0f.firebaseapp.com",
  databaseURL: "https://reviewbook-1af0f.firebaseio.com",
  projectId: "reviewbook-1af0f",
  storageBucket: "reviewbook-1af0f.appspot.com",
  messagingSenderId: "357029016894",
  appId: "1:357029016894:web:95d3d1711b442cbfc5286f",
  measurementId: "G-GP50EN1R49"
};
firebase.initializeApp(firebaseConfig);

const dateNow = Date.now();
var quesNew = [];
const quesDelete = {};

const removeNewQues = () => {
  quesNew = [];
};

firebase
  .database()
  .ref()
  .child("Questions")
  .on("child_added", function(snapshot) {
    if (dateNow < snapshot.val()["numberTime"]) {
      var obj = {};
      obj[snapshot.key] = snapshot.val();
      quesNew.push(obj);
    }
  });
firebase
  .database()
  .ref()
  .child("Questions")
  .on("child_removed", function(snapshot) {
    quesDelete[snapshot.key] = true;
  });

const uploadImage = async file => {
  var result = {};
  var dataStr = new Date().getTime();
  var name = file.name;
  var fileCompleteName = name + "_" + dataStr;
  var storageRef = firebase
    .storage()
    .ref()
    .child("Question Images");
  var reviewStorageRef = storageRef.child(fileCompleteName);
  await reviewStorageRef.put(file).then(async function() {
    result.nameImage = fileCompleteName;
    await reviewStorageRef.getDownloadURL().then(function(url) {
      result.url = url;
    });
  });
  return result;
};
const uploadAudio = async file => {
    var result = {};
    var dataStr = new Date().getTime();
    var name = file.name;
    var fileCompleteName = name + "_" + dataStr;
    var storageRef = firebase
      .storage()
      .ref()
      .child("Question Audio");
    var reviewStorageRef = storageRef.child(fileCompleteName);
    await reviewStorageRef.put(file).then(async function() {
      result.nameImage = fileCompleteName;
      await reviewStorageRef.getDownloadURL().then(function(url) {
        result.url = url;
      });
    });
    return result;
  };
export { uploadImage, quesNew, removeNewQues, quesDelete, uploadAudio };