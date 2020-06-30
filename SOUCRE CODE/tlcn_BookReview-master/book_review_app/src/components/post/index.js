import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Comment,
  Tooltip,
  Modal,
  Button,
  Popover,
  Icon as Ico,
  Spin,
  Menu,
  Dropdown
} from "antd";
import moment from "moment";
import Swal from "sweetalert2";
import htmlParser from "react-html-parser";
import { Icon } from "react-icons-kit";
import { heart } from "react-icons-kit/fa/heart";
import { heartO } from "react-icons-kit/fa/heartO";
// import css
import "./index.scss";
import axios from "axios";
import CreateComment from "../createComment";
import EditPostModal from "./editPostModal";
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import { FacebookShareButton } from "react-share";
//redux
import { useDispatch } from "react-redux";
import { setPost } from "../../actions/posts/setPost";
import { setUserPost } from "../../actions/userPost/setUserPost";
import { postDelete } from "../../firebase/my-firebase";

const Index = props => {
  const {
    commentCount,
    user,
    likes,
    img,
    nameImage,
    content,
    postTime,
    id,
    idCurrentUser,
    title,
    kind
  } = props;
  const postDay2 = new Date(postTime);
  const { avatar, username } = user;
  const [showAllComment, setShowAllComment] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [likeLocal, setLikeLocal] = useState([]);
  const [iconType, setIconType] = useState(
    Object.keys(likes).indexOf(idCurrentUser) !== -1 ? heart : heartO
  );
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [loadingCmt, setLoadingCmt] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const dateNow = Date.now();
  const commentRef = firebase
    .database()
    .ref()
    .child("Comments")
    .child(id);
  const { confirm } = Modal;
  const dispatch = useDispatch();

  commentRef.on("child_added", function(snapshot) {
    if (snapshot.val()["numberTime"] > dateNow) {
      var result = {
        key: snapshot.key,
        value: snapshot.val()
      };

      if (!commentData.some(v => v.id === result.key)) {
        let newCmt = {
          id: result.key,
          body: result.value.body,
          id_user: result.value.id_user,
          imageUser: result.value.imageUser,
          nameUser: result.value.nameUser,
          time: result.value.time
        };
        commentData.unshift(newCmt);
        setCommentData([...commentData]);
      }
    }
  });

  commentRef.on("child_changed", function(snapshot) {
    var result = {
      key: snapshot.key,
      value: snapshot.val()
    };
  });

  commentRef.on("child_removed", function(snapshot) {
    var result = snapshot.key;
  });

  useEffect(() => {
    let likeList = [];
    Object.keys(likes).forEach((v, k) => {
      likeList.push({
        id: v,
        name: Object.values(likes)[k]
      });
    });
    setLikeLocal(likeList);

    const likeBtn = window.document.querySelector(`[id=${id}]`);
    likeBtn.addEventListener("click", () => {
      likeBtn.classList.toggle("isLiked");
      likeBtn.classList.contains("isLiked")
        ? setIconType(heart)
        : setIconType(heartO);
    });
  }, []);

  const deleteHandler = () => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá bài viết này ?",
      onOk() {
        axios({
          method: "delete",
          url: `http://localhost:8080/reviewbook/review/post/own/${
            currentUser.id
          }/${id}?token=${localStorage.getItem("token")}`
        }).then(res => {
          if (props.params) {
            axios({
              method: "get",
              url: `http://localhost:8080/reviewbook/review/post/own/${props.params.userID}`
            }).then(res => {
              dispatch(setUserPost({}))
              dispatch(setUserPost(res.data))
            });
          } else {
            axios({
              method: "get",
              url: `http://localhost:8080/reviewbook/review/post`
            }).then(res => {
              dispatch(setPost({}))
              dispatch(setPost(res.data))
            });
          }
        });
      },
      onCancel() {}
    });
  };

  const editHandler = () => {
    setEditModalVisible(true);
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => editHandler()}>
        <Ico type="edit" /> Edit this post
      </Menu.Item>
      <Menu.Item onClick={() => deleteHandler()}>
        <Ico type="delete" /> Delete this post
      </Menu.Item>
    </Menu>
  );

  const loadComments = () => {
    setLoadingCmt(true);
    setShowAllComment(true);
    axios({
      method: "get",
      url: `http://localhost:8080/reviewbook/review/comment/${id}`
    }).then(res => {
      if (res.data.success !== false) {
        let arr = [];
        Object.keys(res.data).forEach((k, i) => {
          let value = Object.values(res.data)[i];
          arr.push({
            id: k,
            body: value.body,
            id_user: value.id_user,
            imageUser: value.imageUser,
            nameUser: value.nameUser,
            time: value.time
          });
        });
        setCommentData([...arr.reverse()]);
      }
      setLoadingCmt(false);
    });
  };

  const whoLikes = () => {
    let html = ``;
    likeLocal.forEach(v => {
      html += `<p>${v.name}<p/>`;
    });
    return htmlParser(html);
  };

  const likeHandler = () => {
    if (!postDelete.hasOwnProperty(id)) {
      if (!currentUser || !localStorage.getItem("token")) {
        Swal.fire({
          title: "Đăng nhập để bắt đầu like nha !",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK"
        }).then(result => {
          if (result.value) {
            props.history.push("/");
          }
        });
      } else {
        const likeBtn = window.document.querySelector(`[id=${id}]`);
        if (likeBtn.classList.contains("isLiked")) {
          likeLocal.push({
            id: idCurrentUser,
            name: `${currentUser.firstName}  ${currentUser.lastName}`
          });
          setLikeLocal([...likeLocal]);
        } else {
          setLikeLocal([...likeLocal.filter(v => v.id !== idCurrentUser)]);
        }

        axios({
          method: "post",
          url: `http://localhost:8080/reviewbook/review/like/${id}?token=${localStorage.getItem(
            "token"
          )}`
        }).then(() => {});
      }
    }
  };

  const renderComments = () => {
    return Object.values(commentData).map((v, k) => {
      let time2 = new Date(v.time);
      return (
        <Comment
          key={v.id}
          author={v.nameUser}
          avatar={<Avatar src={v.imageUser} alt={v.time} onClick={() => props.history.push(`profile/${v.id_user}`)}/>}
          content={<p>{v.body}</p>}
          datetime={
            <Tooltip title={time2.toLocaleString()}>
              <span>
                {moment([
                  time2.getFullYear(),
                  time2.getMonth(),
                  time2.getDate(),
                  time2.getHours(),
                  time2.getMinutes(),
                  time2.getSeconds(),
                  time2.getMilliseconds()
                ]).fromNow()}
              </span>
            </Tooltip>
          }
        />
      );
    });
  };

  return (
    <>
      <div className="postForm">
        <div className="header">
          <div className="avatar">
            <Avatar
              size={45}
              src={avatar}
              onClick={() => props.history.push(`/profile/${user.id}`)}
            />
          </div>
          <div className="username">
            <p onClick={() => props.history.push(`/profile/${user.id}`)}>
              <i>{username}</i>
            </p>
            <div className="time">
              <a title={postTime}>
                {moment([
                  postDay2.getFullYear(),
                  postDay2.getMonth(),
                  postDay2.getDate(),
                  postDay2.getHours(),
                  postDay2.getMinutes(),
                  postDay2.getSeconds(),
                  postDay2.getMilliseconds()
                ]).fromNow()}
              </a>
            </div>
          </div>
          <div className="top-right">
            {user.id.indexOf(idCurrentUser) !== -1 && (
              <Dropdown overlay={menu} trigger={["click"]}>
                <Ico
                  style={{ fontSize: "28px" }}
                  type="ellipsis"
                  className="ant-dropdown-link"
                />
              </Dropdown>
            )}
          </div>
        </div>
        <div className="body">
          <img src={img}></img>
        </div>
        <div className="userContent">
          <p style={{ margin: "0 5px 0 0" }}>{username}</p>
          <p>{content}</p>
        </div>
        <div className="likes">
          <Icon
            size={24}
            icon={iconType}
            className={
              Object.keys(likes).indexOf(idCurrentUser) !== -1 ? "isLiked" : ""
            }
            id={id}
            onClick={() => likeHandler()}
          />
          <Ico
            style={{ fontSize: "24px" }}
            type="message"
            onClick={() => {
              loadComments();
            }}
          />
          {/* <Ico style={{ fontSize: '24px' }} type="link" /> */}
          <FacebookShareButton
            children={<Ico style={{ fontSize: "24px" }} type="link" />}
            url="https://www.facebook.com/TOIEC-Academy-QT-104284311334666"
            className="share-btn"
          />
        </div>

        <div className="likes-and-comments">
          <div className="likeCount">
            <Popover content={whoLikes()}>
              {likeLocal.length} lượt thích
            </Popover>
          </div>
          <div className="commentsCount">
            <a
              onClick={() => {
                loadComments();
              }}
            >
              {commentData.length > 1 ? commentData.length : commentCount} bình
              luận
            </a>
          </div>
        </div>
       
        <CreateComment
          idPost={id}
          idCurrentUser={idCurrentUser}
          setShowAllComment={e => {
            setShowAllComment(e);
          }}
          commentData={commentData}
        />
        <div className="comments">
          <Spin spinning={loadingCmt}>
            {showAllComment && renderComments()}
          </Spin>
          {showAllComment && (
            <div className="seeAll">
              <a
                onClick={() => {
                  setShowAllComment(false);
                }}
              >
                Hide comments
              </a>
            </div>
          )}
        </div>
        <EditPostModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          idPost={id}
          title={title}
          kind={kind}
          desc={content}
          url={img}
          nameImage={nameImage}
          currentUser={currentUser}
          params={props.params}
        />
      </div>
    </>
  );
};

export default withRouter(Index);
