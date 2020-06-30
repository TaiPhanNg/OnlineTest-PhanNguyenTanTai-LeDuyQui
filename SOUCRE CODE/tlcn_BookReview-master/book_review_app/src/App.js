import React, { Suspense } from "react";
import "./App.css";
import AppRouters from "./Router";
import NavBar from "./components/nav";
import Chatbar from "./components/chatBar";
import Login from "../src/pages/login";
import Menu from "./components/navMenu";
import { BrowserRouter as Router } from "react-router-dom";
import { Row, Col, Carousel } from "antd";
import {
  DingtalkOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CaretDownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationOutlined,
  ApartmentOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  VerifiedOutlined,
  LikeOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
const App = (props) => {
  const style = { padding: "8px 0", fontsize: "large", color: "beige" };
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Chatbar />
          <NavBar />

          <AppRouters />
          <div className="footerdad">
            <Row>
              <Col className="col-info" style={style} span={8}>
                <div className="col-info-body">
                  <h2 className="col-info-title">
                    <DingtalkOutlined /> VỀ TOEIC ACADEMY Q&T
                  </h2>
                  <div className="col-info-content">
                    <h3 className="col-info-content-h3">
                      Giúp bạn luyện tập Toeic mỗi ngày
                    </h3>
                    <h3 className="col-info-content-h3">Thi thử Toeic</h3>
                    <h3 className="col-info-content-h3">
                      Trau dồi kiến thức mỗi ngày
                    </h3>
                    <h3 className="col-info-content-h3">
                      Nhiều tài liệu hữu ích
                    </h3>
                    <h3 className="col-info-content-h3">
                      Thông tin các khóa học
                    </h3>
                  </div>
                </div>
              </Col>
              <Col className="col-info1" style={style} span={8}>
                <div className="col-info-body1">
                  <h2 className="col-info-title">
                    <VerifiedOutlined /> CHĂM SÓC KHÁCH HÀNG
                  </h2>
                  <div className="col-info-content">
                    <h3 className="col-info-content-h3">Tài khoản miễn phí</h3>
                    <h3 className="col-info-content-h3">Hướng dẫn cách học</h3>
                    <h3 className="col-info-content-h3">
                      Hướng dẫn cách thanh toán
                    </h3>
                    <h3 className="col-info-content-h3">
                      Tài khoản Premium vĩnh viễn
                    </h3>
                    <h3 className="col-info-content-h3">
                      Chính sách bảo mật an toàn
                    </h3>
                    <h3 className="col-info-content-h3">Hỗ trợ tài khoản</h3>
                    <h3 className="col-info-content-h3">Hỏi & Đáp</h3>
                    <h3 className="col-info-content-h3">
                      Thời gian hỗ trợ hàng ngày <br /> (9am-10pm)
                    </h3>
                    <div className="col-info-content-direct">
                      <h3 className="col-info-content-h3">
                        <PhoneOutlined /> 0392209933
                      </h3>
                      <h3 className="col-info-content-h3">
                        <TeamOutlined /> Hỗ trợ trực tuyến
                      </h3>
                      <h3 className="col-info-content-h3">
                        <MailOutlined /> tantaiphan1809@gmail.com
                      </h3>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="col-info2" style={style} span={8}>
                <div className="col-info-body2">
                  <h2 className="col-info-title">
                    <ApartmentOutlined /> KẾT NỐI
                  </h2>
                  <div className="col-info-content">
                    <div className="like-share">
                      <h3 className="col-info-content-h3">
                        <LikeOutlined /> Thích{" "}
                      </h3>
                      <h3 className="col-info-content-h3">
                        <FacebookOutlined /> Chia sẻ
                      </h3>
                    </div>
                    <div>
                    <div className="img7"></div>
                    </div>
                    
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Router>
      </Suspense>
    </>
  );
};

export default App;
