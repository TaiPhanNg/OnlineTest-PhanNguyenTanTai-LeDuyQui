import React,{ useState, useEffect } from 'react'
import { Input, Layout, Menu, Icon, Switch, Badge,Typography,Row,Col } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
// import css
import './index.scss'
import { withRouter } from 'react-router-dom'
import Header from 'antd/lib/calendar/Header';
import axios from 'axios'
import { BellOutlined,UserOutlined } from '@ant-design/icons';
//import redux
import { useSelector, useDispatch } from 'react-redux'
import { setPost } from '../../actions/posts/setPost'
import { setUserPost } from '../../actions/userPost/setUserPost'

const { Search } = Input;
function Index(props) {
  const { SubMenu } = Menu
  const { Header, Content, Sider,Footer } = Layout;
  const { Title } = Typography;
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const [messageCount, setMessageCount] = useState(0)
  const dispatch = useDispatch()
  // handleClick = e => {
  //   console.log('click ', e);
  //   this.setState({
  //     current: e.key,
  //   });
  // };
  let heightChange = true
  const loadNotify = () => {
    setInterval(() => {
      setMessageCount(messageCount => messageCount + 1)
    }, 10000);
  }
  useEffect(() => {
    loadNotify()
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 50 && heightChange === true) {
        window.document.querySelector('.nav') && window.document.querySelector('.nav').classList.add('minimize')
        window.document.querySelector('.inforForm') && window.document.querySelector('.inforForm').classList.add('fixedPos')
        window.document.querySelector('.container_chatBar') && window.document.querySelector('.container_chatBar').classList.add('moveUP')

        heightChange = false
      }
      if (window.scrollY <= 50 && heightChange === false) {
        window.document.querySelector('.nav') && window.document.querySelector('.nav').classList.remove('minimize')
        window.document.querySelector('.inforForm') && window.document.querySelector('.inforForm').classList.remove('fixedPos')
        window.document.querySelector('.container_chatBar') && window.document.querySelector('.container_chatBar').classList.remove('moveUP')
        heightChange = true
      }
    })
  }, [])
  const searchHandler = (value) => {
    axios({
      method: 'post',
      url: `http://localhost:8080/reviewbook/review/search?token=${localStorage.getItem('token')}`,
      data: {
        query: value
      }
    }).then((res) => {
      dispatch(setPost([...res.data]))
    })
  }
  return (
    <Layout>
    <Header >
        
        <div className='container'>
          <div className='logo' onClick={() => props.history.push(`/newsFeed`)}></div>
          <div className='text_head'>TRAINING TOIEC: THE BEST OF VIET NAM</div>
          <div className='searchBar'>
            <Search
              placeholder="input search text"
              onSearch={value => searchHandler(value)}
              style={{ width: 200 }}
            />
            </div>
            <div className='notify'>
              <Badge count={messageCount}>
                <MailOutlined className='icon'/>
              </Badge>
              <Badge count={5}>
                <BellOutlined className='icon' />
              </Badge>
              {
                currentUser && (
                  <Badge count={0}>
                    <UserOutlined type="user" className='icon' onClick={() => props.history.push(`/profile/${currentUser.id}`)} />
                  </Badge>
                )
              }
            </div>
        </div>
        <div className='bhead'>
            <div className='container1'>
            <Menu theme='light' mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item className='home'>
                <li>Trang chủ</li>
              </Menu.Item>
              <SubMenu className='sub2' icon={<SettingOutlined />} title="Về chúng tôi">
              </SubMenu>
              <SubMenu className='sub2' icon={<SettingOutlined />} title="Diễn đàn trao đổi" onClick={() => props.history.push(`/newsFeed`)}>
              </SubMenu>
              <SubMenu className='sub2' icon={<SettingOutlined />} title="Các khóa học online(sưu tầm)">
                <Menu.Item key="7">Khóa học miễn phí</Menu.Item>
                <Menu.Item key="8">Khóa học có tính phí</Menu.Item>
              </SubMenu>
              <SubMenu className='sub2' icon={<SettingOutlined />} title="Tài liệu TOIEC">
                <Menu.Item key="7">Tổng hợp sách ôn luyện</Menu.Item>
                <Menu.Item key="8">Ngữ pháp & Từ vựng ôn luyện</Menu.Item>
              </SubMenu>
              <SubMenu className='sub2' icon={<SettingOutlined />} title="Training Test">
                <Menu.Item key="7">Level 250-500</Menu.Item>
                <Menu.Item key="8">Level 500-700</Menu.Item>
                <Menu.Item key="9">Level 700-900</Menu.Item>
              </SubMenu>
              <Menu.Item className='sub2' key="alipay">
                <a href="./test" target="_blank" rel="noopener noreferrer">
                  Thi thử TOIEC online
                </a>
              </Menu.Item>
            </Menu>
            </div>
          </div>
         
    </Header>
    
    </Layout> 

  )
}

export default withRouter(Index)