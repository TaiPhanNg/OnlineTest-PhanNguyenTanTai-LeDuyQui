import React, { useState, useEffect } from "react";
import {
  Card,
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
  const { Meta } = Card;
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
      <h1 className="quiz-title">BỘ TÀI LIỆU ÔN LUYỆN TOIEC MỚI</h1>
      <h2></h2>
      <div className="listtrain2">
        <h1 className="listtrain2-title"> Q&T ACADEMY</h1>
        <List
          itemLayout="horizontal"
          dataSource={data}
          className="content1"
          loading={loadingData}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 1,
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item>
              <Card
                hoverable
                style={{ width: 240 }, {margin:50}}
                cover={<img alt="example" src="https://www.anhngumshoa.com/uploads/images/userfiles/2019/06/neweconomytoeic2019_1.jpg" />}
              >
                <Meta title="ECONOMY NEW 2020" description="https://www.facebook.com/toiecqt" />
              </Card>
              <Card
                hoverable
                style={{ width: 240 }, {margin:50}}
                cover={<img alt="example" src="https://toeic24.vn/upload/postfeaturedimg/1578474970.jpg" />}
              >
                <Meta title="ETS 2O2O" description="https://www.facebook.com/toiecqt" />
              </Card>
              <Card
                hoverable
                style={{ width: 240 }, {margin:50}}
                cover={<img alt="example" src="https://i.ytimg.com/vi/4Lt3KjtvIQ4/maxresdefault.jpg" />}
              >
                <Meta title="Barron's" description="https://www.facebook.com/toiecqt" />
              </Card>
              </List.Item>
            </List.Item>
            
          )}
        />
        <h2 className="footer-d">Toeic Test Offical</h2>
      </div>
    </div>
  );
}

export default withRouter(Index);
