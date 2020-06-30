import React, { useState, useEffect } from "react";
import {
  Table,
  Divider,
  Tag,
  notification,
  Skeleton,
  Button,
  Popconfirm,
  List,
  Avatar,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import "./index.scss";
import { Route, withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
// import CreateQuiz from './createQuiz'
// import EditForm from './Edit'
function Index(props) {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [idQuiz, setIdQuiz] = useState("");
  useEffect(() => {
    loadData();
  }, []);
  const showModal = () => {
    setVisible(true);
    console.log(idQuiz);
  };
  const showEdit = (id) => {
    setIdQuiz(id);
    console.log(id);
    setEdit(true);
  };
  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
    setEdit(false);
  };
  const loadData = () => {
    setLoadingData(true);
    axios({
      method: "get",
      url: `http://localhost:8080/reviewbook/allquiz`,
    }).then((res) => {
      let arr = [];
      try {
        Object.values(res.data).map((v, i) => {
          let value = Object.values(v)[0];
          if (value.kind == "toeic") {
            arr.push({
              key: Object.keys(v)[0],
              id: Object.keys(v)[0],
              stt: i + 1,
              kind: value.kind,
              dates: value.dateStart,
              time: value.dateCreate,
              active: value.active
                ? value.active.length > 0 && value.active
                : "Chưa xác định",
              role: value.role
                ? value.role.length > 0 && value.role
                : "Chưa xác định",
              tags: ["Quiz đã được thông qua"],
            });
          }
        });
      } catch (err) {
        arr = [];
      }
      setData([...arr]);
      setLoadingData(false);
    });
  };
  const demoImage = (image) => {
    Swal.fire({
      imageUrl: image,
    });
  };
  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      render: (text) => <p>{text}</p>,
    },

    {
      title: "Đề",
      dataIndex: "time",
      key: "time",
      render: (time) => (
        <a
          Link
          onClick={() => props.history.push(`/newsFeed`)}
          style={{
            wordWrap: "break-word",
            wordBreak: "break-word",
            maxHeight: "10em",
          }}
        >
          Đề của ngày {time.substring(0, 40)}
        </a>
      ),
    },
    {
      title: "Loại",
      dataIndex: "kind",
      key: "kind",
      render: (kind) => (
        <Tag color={"magenta"}>
          <p
            style={{
              wordWrap: "break-word",
              wordBreak: "break-word",
              maxHeight: "10em",
            }}
          >
            {kind.substring(0, 40)}
          </p>
        </Tag>
      ),
    },
  ];

  return (
    <div className="quiz-body">
      {/* <Button style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => loadData()} type='primary'>Refresh</Button> */}
      {/* <Button type="primary" style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => showModal()}>
        <PlusOutlined /> Tạo bộ Đề
        </Button> */}

      {/* <Table pagination={{ pageSize: 6 }} columns={columns} dataSource={data} loading={loadingData} className="content" /> */}
      <h1 className="quiz-title">ĐỀ THI TOEIC CHÍNH THỨC</h1>
      <h2>Các mẫu đề chính thức</h2>
      <div className="listtrain2">
        <h1 className="listtrain2-title"> List các đề thi thử toeic</h1>
        <List
          itemLayout="horizontal"
          dataSource={data}
          className="content1"
          loading={loadingData}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                className="listitem1"
                onClick={() => props.history.push(`/doquiz/${item.id}`)}
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a>TOEIC FOR {item.time}</a>}
                description="ĐỀ THI CHÍNH THỨC 120 PHÚT"
              />
            </List.Item>
          )}
        />
        <h2 className="footer-d">Toeic Test Offical</h2>
      </div>
    </div>
  );
}

export default withRouter(Index);
