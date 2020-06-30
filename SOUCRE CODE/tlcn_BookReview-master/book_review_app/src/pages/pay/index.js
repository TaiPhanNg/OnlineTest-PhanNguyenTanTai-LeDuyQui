import React, { useState, useEffect, } from 'react'
import { Radio, Table, Divider, Tag, Input, Icon, notification, Empty, Form, Skeleton, Button, Popconfirm, Modal, Popover, Card, Avatar } from 'antd'
import axios from 'axios'
import Swal from 'sweetalert2'
import './index.scss'
import PlayAudio from 'react-simple-audio-player'
import { withRouter, Route } from "react-router-dom";
import { Link } from 'react-router-dom'
import {CheckOutlined, CloseOutlined,ExclamationOutlined,ContainerOutlined} from '@ant-design/icons'
// import CreateQuiz from './createQuiz'
// import EditForm from './Edit'
import Paypal from '../../components/utils/hoc/Paypal/paypal'
function Index(props) {

    // const [idQuiz, setIdQuiz] = useState('')
    // const { diemReading, diemListen, idQuiz, day, listAnswer,listAnswertmp } = props.location.state
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    const { firstName, lastName, gender, id, birthday, email, image, phone } = currentUser
    const [data, setData] = useState([])
    const [visible, setVisble] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    var num = 0
    var listPre =[]
    var finalStt = 0;
    //const { isShowing, toggle } = useModal();

    useEffect(() => {
        loadPremier()
        setVisble(false)
    }, [])

    //  
    const loadPremier=()=>{
        setLoadingData(true)
        axios({
            method: 'get',
            url:`http://localhost:8080/reviewbook/premier`,
        }).then((res)=>{
            let arr=[]
            console.log(res.data)
            listPre=[...res.data]
            try{
                
            } catch (err) {
                arr = []
            }
            
            setLoadingData(false)
           console.log(listPre)
        })
    }

    
    const handleOk=()=>{
        setVisble(false)
    }
    const handleCancel=()=>{
        setVisble(false)
    }
    const onSuccess = (data) => {
        var id =currentUser.id
        var premier =true

        axios({
            method: 'post',
            url: `http://localhost:8080/reviewbook/premier/${id}?token=${localStorage.getItem('token')}`,
          }).then(res => {
              alert(1)
            notification.success({
              message: 'Xong !',
              placement: 'bottomRight',
            })
           
          })
        // Congratulation, it came here means everything's fine!
        console.log("The payment was succeeded!",data);
          
        // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onCancel = () => {
        // User pressed "cancel" or close Paypal's popup!
        console.log('The payment was cancelled!');
        // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onError = () => {
        // The main Paypal's script cannot be loaded or somethings block the loading of that script!
        console.log("Error!");
        // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
        // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    }
  
    const match =(id)=>{
        if(listPre.indexOf(id))
        {
            return true
        }
        else{
            return false
        }
    }


    return (
            <div className="test-playfield">             
                <ul className="score-report">
                    <li className="personal-info">
                        <h2 className="name">
                            {`${currentUser.firstName} ${currentUser.lastName}`}
                        </h2>                        
                    </li>
                    <li className="component-scores2">
                        <div className="listening-score-wrapper2">
                            <div className="score-label">Tài Khoản</div>
                            <div className="score-value2">{(match(currentUser.id)?'Premium':'Thường')}</div>
                        </div>
                    </li>
                </ul>
                <h1 className='inf'>THÔNG TIN TÀI KHOẢN</h1>
                <h2 className='dis'>!!!Đang có khuyến mãi!!!</h2>
                <ul className="score-report">
                    <li className="personal-info">
                        <h2 className="name">
                            {`${currentUser.firstName} ${currentUser.lastName}`}
                        </h2>
                        
                    </li>
                    <li className="component-scores">
                        <div className="listening-score-wrapper">
                            <div className="score-label">Tài Khoản</div>
                            <div className="score-value">Thường</div>
                            <h2>Làm training mỗi ngày(thường)<CheckOutlined/> </h2>
                            <h2>Tham gia diễn đàn <CheckOutlined/> </h2>
                            <h2>Xem tài liệu miễn phí <CheckOutlined/> </h2>
                            <h2>Được sử dụng các để thi thử chính thức (đề thường) <CheckOutlined/> </h2>
                            <h2>Xem điểm <CheckOutlined/> </h2>
                            <h2>Làm training mỗi ngày bao gồm tất cả loại đề không giới hạn<CloseOutlined/> </h2>
                            <h2>Được sử dụng nhiều đề thi chính thức không giới hạn<CloseOutlined/> </h2>
                            <h2>Xem bộ đáp án <CloseOutlined/></h2>

                        </div>
                        <Button className='free' >FREE</Button>
                    </li>
                    <li className="component-scores">
                        <div className="listening-score-wrapper">
                            <div className="score-label">Tài Khoản</div>
                            <div className="score-value">Premier</div>
                            <h2>Làm training mỗi ngày(thường)<CheckOutlined/> </h2>
                            <h2>Tham gia diễn đàn<CheckOutlined/> </h2>
                            <h2>Xem tài liệu miễn phí<CheckOutlined/> </h2>
                            <h2>Được sử dụng các để thi thử chính thức (đề thường)<CheckOutlined/> </h2>
                            <h2>Xem điểm <CheckOutlined/> </h2>
                            <h2>Làm training mỗi ngày bao gồm tất cả loại đề không giới hạn<CheckOutlined/> </h2>
                            <h2>Được sử dụng nhiều đề thi chính thức không giới hạn<CheckOutlined/> </h2>
                            <h2>Xem bộ đáp án<CheckOutlined/> </h2>
                            
                        </div>
                        <Button onClick={()=>setVisble(true)} className='vip' >Đăng ký ngay giảm ngay 30%<br/>
                        từ 99.000 vnđ chỉ còn 69.00 vnđ
                        </Button>
                        <h3 className='paya'>Thanh toán ngay bằng Paypal</h3>
                        <Paypal className='paypalbutton'
                        toPay={3}
                        onSuccess={onSuccess}
                        onCancel={onCancel}
                        onError={onError}
                        />                        
                    </li>                    
                </ul>
            </div>            
    )
}

export default withRouter(Index) 
