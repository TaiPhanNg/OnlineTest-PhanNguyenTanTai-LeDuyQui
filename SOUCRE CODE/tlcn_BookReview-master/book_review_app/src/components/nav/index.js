import React, { useState, useEffect } from "react";
import { Input, Badge, Icon, Menu, Alert, notification, Button } from "antd";
import { withRouter } from "react-router-dom";
import "./index.scss";
import axios from "axios";
import {
  MailOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  SmileOutlined,
} from "@ant-design/icons";
//import redux
import { useSelector, useDispatch } from "react-redux";
import { setPost } from "../../actions/posts/setPost";
import { setUserPost } from "../../actions/userPost/setUserPost";

const { Search } = Input;

function Index(props) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [messageCount, setMessageCount] = useState(0);
  const dispatch = useDispatch();
  const { SubMenu } = Menu;
  let heightChange = true;
  const loadNotify = () => {
    setInterval(() => {
      setMessageCount((messageCount) => messageCount + 1);
    }, 10000);
  };
  useEffect(() => {
    loadNotify();
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 0 && heightChange === true) {
        window.document.querySelector(".container-nav") &&
          window.document
            .querySelector(".container-nav")
            .classList.add("minimize");
        window.document.querySelector(".inforForm") &&
          window.document.querySelector(".inforForm").classList.add("fixedPos");
        window.document.querySelector(".container_chatBar") &&
          window.document
            .querySelector(".container_chatBar")
            .classList.add("moveUP");

        heightChange = false;
      }
      if (window.scrollY <= 50 && heightChange === false) {
        window.document.querySelector(".container-nav") &&
          window.document
            .querySelector(".container-nav")
            .classList.remove("minimize");
        window.document.querySelector(".inforForm") &&
          window.document
            .querySelector(".inforForm")
            .classList.remove("fixedPos");
        window.document.querySelector(".container_chatBar") &&
          window.document
            .querySelector(".container_chatBar")
            .classList.remove("moveUP");
        heightChange = true;
      }
    });
  }, []);

  const searchHandler = (value) => {
    axios({
      method: "post",
      url: `http://localhost:8080/reviewbook/review/search?token=${localStorage.getItem(
        "token"
      )}`,
      data: {
        query: value,
      },
    }).then((res) => {
      dispatch(setPost([...res.data]));
    });
  };
  const unKnown = () => {
    openNotification();
    alert("Bạn phải đăng nhập để tiếp tục chức năng");
    props.history.push("/login");
  };
  const openNotification = () => {
    notification.open({
      message: "Xin lỗi về sự bất tiện này",
      description:
        "Bạn cần phải đăng nhập để vào trang thi Toeic chính thức, nhầm thực hiện các chính sách bảo mật, Bạn nhé",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };
  return window.location.pathname !== "/login" ? (
    window.location.pathname !== "/login" ? (
      window.location.pathname !== "/admin" ? (
        <div className="nav">
          <div className="container-nav">
            <div
              className="logo"
              onClick={() => props.history.push(`/newsFeed`)}
            ></div>
            {window.location.pathname == "/newsFeed" && (
              <div className="searchBar">
                <Search
                  placeholder="input search text"
                  onSearch={(value) => searchHandler(value)}
                  style={{ width: 200 }}
                />
              </div>
            )}

            <div className="notify">
              <Badge count={messageCount}>
                <MailOutlined
                  className="icon"
                  onClick={() => props.history.push(`/main`)}
                />
              </Badge>
              <Badge count={5}>
                <BellOutlined className="icon" />
              </Badge>
              {currentUser && (
                <Badge count={0}>
                  <UserOutlined
                    type="user"
                    className="icon"
                    onClick={() =>
                      props.history.push(`/profile/${currentUser.id}`)
                    }
                  />
                </Badge>
              )}

              {!currentUser && (
                <Button
                  className="dangnhapbtn"
                  onClick={() => props.history.push(`/login`)}
                >
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
          <div className="nav-subnav">
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]}>
              <Menu.Item className="home">
                <li onClick={() => props.history.push(`/main`)}>Trang chủ</li>
              </Menu.Item>

              <Menu.Item
                className="sub1"
                key="alipay"
                icon={<SettingOutlined />}
              >
                <a
                  onClick={() => props.history.push("/aboutme")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Về chúng tôi
                </a>
              </Menu.Item>

              <Menu.Item
                className="sub2"
                key="alipay"
                icon={<SettingOutlined />}
              >
                <a
                  onClick={() => props.history.push("/newsFeed")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Diễn đàn trao đổi
                </a>
              </Menu.Item>
              <Menu.Item
                className="sub1"
                key="alipay"
                icon={<SettingOutlined />}
              >
                <a
                  onClick={() => props.history.push("/document")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tài liệu ôn TOIEC
                </a>
              </Menu.Item>
              <SubMenu
                className="sub2"
                icon={<SettingOutlined />}
                title="Training Test"
              >
                <Menu.Item
                  onClick={() =>
                    props.history.push({
                      pathname: "/training",
                      state: {
                        kind: "250-500",
                      },
                    })
                  }
                  key="7"
                >
                  Level 250-500
                </Menu.Item>
                <Menu.Item
                  key="8"
                  onClick={() =>
                    props.history.push({
                      pathname: "/training",
                      state: {
                        kind: "500-700",
                      },
                    })
                  }
                >
                  Level 500-700
                </Menu.Item>
                <Menu.Item
                  key="9"
                  onClick={() =>
                    props.history.push({
                      pathname: "/training",
                      state: {
                        kind: "700-900",
                      },
                    })
                  }
                >
                  Level 700-900
                </Menu.Item>
              </SubMenu>
              {currentUser && (
                <Menu.Item className="sub2" key="alipay">
                  <a
                    onClick={() => props.history.push("/quiz")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Thi thử TOIEC online
                  </a>
                </Menu.Item>
              )}
              {!currentUser && (
                <Menu.Item className="sub2" key="alipay">
                  <a
                    onClick={() => unKnown()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Thi thử TOIEC online
                  </a>
                </Menu.Item>
              )}
            </Menu>
          </div>
        </div>
      ) : (
        ""
      )
    ) : (
      ""
    )
  ) : (
    ""
  );
}

export default withRouter(Index);
