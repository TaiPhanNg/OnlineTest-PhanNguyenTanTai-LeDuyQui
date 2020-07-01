import React, { useState, useEffect } from "react";
import {
  Typography,
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
  const { Paragraph } = Typography;
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
      <h1 className="quiz-title">VỀ CHÚNG TÔI: TOIEC ACADEMY Q&T</h1>
      <h1 className="TamNhin">Tầm nhìn và ước mơ</h1>
      <div className="listtrain2">
        <h1 className="listtrain2-title"> Sứ mệnh: Vươn tầm thế giới</h1>
          <Paragraph className="Para1" ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
          Cải thiện cuộc sống thông qua giáo dục Chúng tôi tin tưởng hoàn toàn vào những thay đổi sâu sắc trong giáo dục đang và sẽ diễn ra rộng khắp thông qua việc áp dụng công nghệ vào giáo dục.
          Và điều này, đối với chúng tôi, là rõ ràng, bởi lẽ công nghệ sẽ cho phép người học tiếp cận được với những kiến thức hữu ích bất kì lúc nào họ muốn, với cách trình bày phù hợp nhất với cách tiếp nhận thông tin của họ.
          Khả năng cá nhân hóa việc học và luyện tập tối ưu cho từng người học sẽ mở ra một kỷ nguyên mới của giáo dục, và chắc chắn sẽ thay đổi hoàn toàn cách chúng ta nghĩ về giáo dục. Không những thế, công nghệ giúp chúng ta đạt được điều này với một chi phí đủ thấp để hầu hết mọi người có thể được giáo dục trong một môi trường tốt nhất - điều mà trước đây chỉ một số ít có được. Đọc thêm về tương lai của giáo dục dưới góc nhìn của Peter Hưng. Và vì thế, chúng tôi xác định sứ mệnh của mình là: Cải thiện cuộc sống thông qua giáo dục – Improving lives through education. 
          </Paragraph>
          <h1 className="listtrain2-title"> Ước mơ của tất cả chúng ta</h1>
          <Paragraph className="Para1" ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
          Hi vọng những chia sẻ ở trên đã giúp bạn hiểu rõ hơn về chúng tôi . 
          Và hi vọng nó đã giúp những bạn lần đầu tiên học online xóa đi những hoài nghi hay lo lắng nào của mình về việc học online ở chúng tôi. Và sau khi học hiệu quả, bạn cũng sẽ giới thiệu với bạn bè và người thân của mình để họ cũng sẽ có thể sử dụng được những giá trị vượt trội mà chúng tôi đang mang lại. Chắc chắn rằng cùng nhau chúng ta sẽ có thể mang tiếng Anh nói riêng và giáo dục đúng nghĩa nói chung đến với tất cả mọi người. Giáo dục chính là nền tảng quan trọng nhất để xây dựng nên một đất nước phát triển phồn vinh, đem đến một tương lai tốt đẹp cho thế hệ của chúng ta và những thế hệ tương lai. 
          Thiết nghĩ, đó là là quyền lợi, là trách nghiệm, và cũng là ước mơ của tất cả chúng ta.
          </Paragraph>
        {/* <List
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
        /> */}
        {/* <h2 className="footer-d">Toeic Test Offical</h2> */}
      </div>
    </div>
  );
}

export default withRouter(Index);
