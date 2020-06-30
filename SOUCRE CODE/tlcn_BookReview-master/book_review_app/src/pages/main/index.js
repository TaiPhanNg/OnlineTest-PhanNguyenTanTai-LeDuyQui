import React, { useState, useEffect } from "react";
import {
  Skeleton,
  Empty,
  Carousel,
  Card,
  Tabs,
  Row,
  Col,
  Typography,
  Layout,
  PageHeader,
  Button,
} from "antd";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import axios from "axios";
//import components
import Post from "../../components/post";
import Infor from "../../components/infor";
import FirstRegister from "../../components/firstRegister";
import LeftBar from "../../components/leftBar";
import CreatePost from "../../components/createPost";

// import css
import "./index.scss";

//import redux
import { useSelector, useDispatch } from "react-redux";
import { setPost } from "../../actions/posts/setPost";

import firebase from "firebase";
import { loadMore } from "../../actions/posts/loadMore";
import { postNew, removeNewPost } from "../../firebase/my-firebase";
const { Meta } = Card;
const { TabPane } = Tabs;
const { Footer, Content } = Layout;
const { Paragraph } = Typography;

function Index(props) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [postList, setPostList] = useState([]);
  const [lastPost, setLastPost] = useState({});
  //redux
  const posts = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  useBottomScrollListener(() => {
    lastPost.numberTime &&
      axios({
        method: "get",
        url: `http://localhost:8080/reviewbook/review/post/${lastPost.numberTime}`,
      }).then((res) => {
        try {
          res.data.length > 0 &&
            setLastPost(Object.values(res.data[res.data.length - 1])[0]);
          postNew.map((v) => {
            res.data.unshift(v);
          });
          dispatch(loadMore(res.data.success === false ? [] : res.data));
          removeNewPost();
        } catch {}
      });
  });

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8080/reviewbook/review/post`,
    }).then((res) => {
      dispatch(setPost(res.data));
      setPostList(res.data);
      setLoading(false);
      try {
        if (!res.data.success) {
          setLastPost(Object.values(res.data[res.data.length - 1])[0]);
        }
      } catch {}
    });
  }, []);

  const loadPosts = () => {
    const list = posts ? posts : postList;
    try {
      return list.map((v, k) => {
        let value = Object.values(v)[0];
        let id = Object.keys(v)[0]; //id bai viet
        let postUser = {
          id: value.uid,
          avatar: value.urlUser,
          username: value.name,
        };
        return (
          <Post
            key={k}
            img={value.urlImage}
            user={postUser} // nguoi dang
            likes={value.likes ? value.likes : {}}
            commentCount={
              value.comments ? Object.keys(value.comments).length : 0
            }
            content={value.desc}
            postTime={value.time}
            id={id}
            idCurrentUser={currentUser ? currentUser.id : null}
            title={value.title}
            kind={value.kind}
          />
        );
      });
    } catch (err) {
      return <Empty />;
    }
  };

  function callback(key) {
    console.log(key);
  }

  return (
    <div>
      {localStorage.getItem("token") === "setting account" && (
        <FirstRegister setCurrentUser={(u) => setCurrentUser(u)} />
      )}
      <div className="content123">
        <div className="wrapper123">
          <div className="center-content123">
            {/* <CreatePost user={currentUser ? currentUser : { image: '', firstName: 'anonymous' }} /> */}
            <Row loading={loading} justify="center" active>
              <Col span={12}>
                {/* {loadPosts()} */}
                <Carousel autoplay>
                  <div>
                    <iframe
                      width="100%"
                      height={515}
                      src="https://www.youtube.com/embed/iuKxUWt9qRE"
                      frameBorder={0}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <iframe
                      width="100%"
                      height={515}
                      src="https://www.youtube.com/embed/veFeIxWlJiQ"
                      frameBorder={0}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </Carousel>
                <div className="heading">
                  <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Thông tin chung về TOIEC" key="1">
                      {/* <ul className='list'> */}
                      <Row justify="space-around">
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="imgg"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                Lệ phí thi TOEIC là bao nhiêu? Địa điểm, thủ tục
                                đăng ký thi TOEIC
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="img1"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                HƯỚNG DẪN ĐĂNG KÍ THI TOIEC TẠI IIG{" "}
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="img2"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                THANG TÍNH ĐIỂM THI TOIEC MỚI
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="img3"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                CẤU TRÚC ĐỀ THI TOIEC
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                      </Row>
                      {/* </ul> */}
                    </TabPane>
                    <TabPane tab="Sách Ôn Luyện Toiec (cập nhật)" key="2">
                      {/* <ul className='list'> */}
                      <Row justify="space-around">
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="img4"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                SÁCH ETS 2020_CÓ ĐÁP ÁN
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="img5"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                SÁCH ECONOMY 2020_CÓ ĐÁP ÁN{" "}
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="img6"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                600 TỪ VỰNG TOIEC KHÔNG THỂ BỎ QUA
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                        <Col span={3}>
                          <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                            <div className="img7"></div>
                          </a>
                          <div className="caption">
                            <Paragraph>
                              <a href="https://www.anhngumshoa.com/tin-tuc/le-phi-thi-toeic-37226.html">
                                SÁCH ENGLISH GRAMMAR IN USE
                              </a>
                            </Paragraph>
                          </div>
                        </Col>
                      </Row>
                      {/* </ul> */}
                    </TabPane>
                    {/* <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                      </TabPane> */}
                  </Tabs>
                </div>

                <div className="tailieu">
                  <span>
                    <h2>TÀI LIỆU LUYỆN THI TOEIC</h2>
                  </span>
                  <div className="slide">
                    <Row>
                      <Col span={12}>
                        <div className="item">
                          <li>
                            <a href="https://drive.google.com/file/d/1KulfnRG3_jAnmc0ageX7BZmZgubHXIXa/view">
                              300 cụm từ chắc chắn xuất hiện trong bài thi
                              TOIEC.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1MN910cLAUUNBhK4frepnMYiKyMaFUZDZ675ShLF7tJk/edit">
                              Tài liệu luyện thi TOIEC: SÁCH VERY EASY TOEIC.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1K0d73NEAigyi9vhP7REGc2HfGq0ctcRl7F0CXco911c/edit">
                              Bộ Economy Vol 1 - 5 và giải chi tiết.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1K0d73NEAigyi9vhP7REGc2HfGq0ctcRl7F0CXco911c/edit">
                              Download ngay trọn bộ english vocabulary in use -
                              từ vựng cho mọi cấp độ.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1K0d73NEAigyi9vhP7REGc2HfGq0ctcRl7F0CXco911c/edit">
                              [Download] American Accent Training – tài liệu
                              phát âm chuẩn giọng MỸ.
                            </a>
                          </li>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="item1">
                          <li>
                            <a href="https://drive.google.com/file/d/1KulfnRG3_jAnmc0ageX7BZmZgubHXIXa/view">
                              300 cụm từ chắc chắn xuất hiện trong bài thi
                              TOIEC.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1MN910cLAUUNBhK4frepnMYiKyMaFUZDZ675ShLF7tJk/edit">
                              Tài liệu luyện thi TOIEC: SÁCH VERY EASY TOEIC.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1K0d73NEAigyi9vhP7REGc2HfGq0ctcRl7F0CXco911c/edit">
                              Bộ Economy Vol 1 - 5 và giải chi tiết.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1K0d73NEAigyi9vhP7REGc2HfGq0ctcRl7F0CXco911c/edit">
                              Download ngay trọn bộ english vocabulary in use -
                              từ vựng cho mọi cấp độ.
                            </a>
                          </li>
                          <li>
                            <a href="https://docs.google.com/document/d/1K0d73NEAigyi9vhP7REGc2HfGq0ctcRl7F0CXco911c/edit">
                              [Download] American Accent Training – tài liệu
                              phát âm chuẩn giọng MỸ.
                            </a>
                          </li>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="infor">
                  <div className="ads_right">
                    <div className="box">
                      <a href="https://www.anhngumshoa.com/tin-tuc/khoa-hoc-toeic-450-500-cho-nguoi-mat-goc-tai-anh-ngu-ms-hoa-37381.html">
                        <div className="box1"></div>
                        <span>ETS BOOK 2020</span>
                      </a>
                    </div>
                    <div className="box">
                      <a href="https://www.anhngumshoa.com/tin-tuc/khoa-hoc-toeic-450-500-cho-nguoi-mat-goc-tai-anh-ngu-ms-hoa-37381.html">
                        <div className="box2"></div>
                        <span>ECONOMY BOOK 2020</span>
                      </a>
                    </div>
                    <div className="box">
                      <a href="https://www.anhngumshoa.com/tin-tuc/khoa-hoc-toeic-450-500-cho-nguoi-mat-goc-tai-anh-ngu-ms-hoa-37381.html">
                        <div className="box3"></div>
                        <span>VOCA BOOK</span>
                      </a>
                    </div>
                  </div>
                  <div className="Fanpage">
                    <PageHeader className="site-page-header">
                      <span>
                        <h2>FANPAGE</h2>
                      </span>
                    </PageHeader>
                    <div className="page1">
                      <Card
                        className="page"
                        hoverable
                        style={{ width: 350 }}
                        cover={
                          <img
                            alt="example"
                            src="https://2.bp.blogspot.com/-e39288GX1C8/WrOp8511wOI/AAAAAAAAAB8/X3ZDjxsov-gmjbl5-6iRig_FopDsU5hqwCLcBGAs/s1600/song-ngu-anh-hoa-merlion-toeic.png"
                          />
                        }
                        title="TOIEC Academy Q&T"
                        href="https://www.facebook.com/TOIEC-Academy-QT-104284311334666/?modal=admin_todo_tour"
                      >
                        <Button
                          className="like"
                          href="https://www.facebook.com/TOIEC-Academy-QT-104284311334666/?modal=admin_todo_tour"
                          type="primary"
                        >
                          Like Page
                        </Button>
                      </Card>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
