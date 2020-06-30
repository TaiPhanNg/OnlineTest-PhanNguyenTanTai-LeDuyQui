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
function Index(props) {

    // const [idQuiz, setIdQuiz] = useState('')
    const { diemReading, diemListen, idQuiz, day, listAnswer,listAnswertmp } = props.location.state
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    const { firstName, lastName, gender, id, birthday, email, image, phone } = currentUser
    const [data, setData] = useState([])
    const [dtPremier, setdtPremier]=useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [visible,setVisible]=useState(false)
    var listPre =[]
    var num = 0

    var finalStt = 0;
    //const { isShowing, toggle } = useModal();

    useEffect(() => {
      
        loadPremier()
        loadData()
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
    const loadData = () => {
        setLoadingData(true)
        axios({
            method: 'get',
            url: `http://localhost:8080/reviewbook/qq/${idQuiz}`,
        }).then((res) => {
            let arr = []
            let list = []
            try {
                Object.values(res.data).map((v, i) => {
                    let value = Object.values(v)[0]

                    arr.push({
                        key: Object.keys(v)[0],
                        id: Object.keys(v)[0],
                        stt: i + 1,
                        content: value.cont,
                        image: value.urlImage,
                        audio: value.urlAudio,
                        part: value.part,
                        a: value.option,
                        time: value.dateCreate,
                        tags: ['Câu hỏi'],
                        filteredInfo: null,
                        sortedInfo: null
                    })

                })
            } catch (err) {
                arr = []
            }
            setData([...arr])
            setLoadingData(false)
           setVisible(false)
        })
    }

    const onChange = (e, crr, part) => {
        console.log(e.target.value)
        let answer = e.target.value
        if (answer == crr && part == '1') {
            console.log(1)

        }

    }
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    //Load du lieu bo dap an
    const compare = (arr1, arr2) => {
        let ls = 0
        let rd = 0
        try {
            for (let i = 0; i < arr2.length; i++) {
    
                if (arr1[i] == arr2[i]) {
    
                    if (i < 100) {
    
                        ls++
                    }
                    else {
                        rd++
                    }
                }
    
    
            }
        } catch (err) {
            console.log(err)
        }
    }
    const loadQues = (part) => {

        var list = data.filter(data => data.part == part)


        try {
            return list.map((v, k) => {
                let id = Object.keys(v)[0] //
                let value = Object.values(v)
                console.log(value)
                num = finalStt
                let idAnswer = id
                return <Card className='card-name' key={k} name={part}
                >

                    {value[4].length > 2 && (<img onClick={() => demoImage(value[4])} className='img_row' src={value[4].length > 0 ? value[4] : 'https://shadow888.com/images/default/noimagefound.png'} />)}
                    {value[5].length > 2 && (<audio controls> <source src={value[5]} type="audio/mpeg" /> </audio>)}
                    {value[3].length > 2 && (<div className='paragraph' >{value[3]}</div>)}


                    {
                        v.a.map((v, i) => {
                            let stt = num + i + 1
                            let crAnswer = v.answer
                            finalStt = stt
                            // let nameQues=part.toString()+'.'+stt.toString()
                            // console.log(nameQues)
                            return <div key={i}>
                        
                              {
                                  (listAnswer[stt-1]!=''&& listAnswer[stt-1] ==listAnswertmp[stt-1])  &&(<h2 className='blue'>Bạn đã chọn {listAnswer[stt-1]} <CheckOutlined /></h2>)
                              }    
                              {
                                  (listAnswer[stt-1]!=''&& listAnswer[stt-1] !=listAnswertmp[stt-1])  &&(<h2 className='red'>Bạn đã chọn {listAnswer[stt-1]} <CloseOutlined /></h2>)
                              }      
                              {
                                  (listAnswer[stt-1]==''||listAnswer[stt-1]==' ')  &&(<h2 className='red'>Bạn chưa chọn Câu trả lời<ExclamationOutlined /> </h2>)
                              } 
                                <h3>{stt}</h3>
                               
                                <h3 className='c'>{v.content}</h3>
                                <Radio.Group name={stt} onChange={(e) => onChange(e, crAnswer, part)}>
                                    <h3 style={radioStyle} name={stt} value={v.a}>
                                        (A) {v.a}
                                    </h3>
                                    <h3 style={radioStyle} name={stt} value={v.b}>
                                        (B) {v.b}
                                    </h3>
                                    <h3 style={radioStyle} name={stt} value={v.c}>
                                        (C) {v.c}
                                    </h3>
                                    {v.d && (
                                        <h3 style={radioStyle} name={stt} value={v.d}>
                                            (D) {v.d}
                                        </h3>
                                    )}<div className='lista'> {  (visible==true) &&(<h2 className='blue2'>Câu trả lời là {listAnswertmp[stt-1]}</h2>)}</div>
                                   
                                    
                                </Radio.Group>
                            </div>
                        })
                    }

                </Card>
            }
            )
        }
        catch (err) {
            console.log(err)
            return <Empty />
        }
    }
    function getRVBN(n) {
        var i, r = document.getElementsByName(n);
        for (i = 0; i < r.length; i++) {
            if (r[i].checked) return r[i].value;
        }
        return '';
    }
    const submitAll = () => {
        // var g = getRVBN('cau');
        var g
        var x = 0
        console.log(finalStt)
        for (let i = 1; i <= finalStt; i++) {
            g = getRVBN(i);

            listAnswer.push(


                g

            )
        }
        compare(listAnswer, listAnswertmp)
        var now = new Date();
        var x = now
        alert("Ngày hôm nay: " + now);
        //.find(v=>
        props.
            history.push({
                pathname: '/result',
                state: {
                    idQuiz: idQuiz,
                    diemListen: diemListen,
                    diemReading: diemReading,
                    day: x
                }
            })

        //       v.id===1
        //   ))
    }
    const demoImage = (image) => {
        Swal.fire({
            imageUrl: image,
        })
    }
    const payorSee =()=>{
        if(listPre.indexOf(currentUser.id))
        {   setVisible(true)
            console.log(currentUser.id)
            console.log('premier nè')
        }
        else{
            props.history.push(`/pay`)
        }
    }

    return (
        <>
            <div class="test-playfield">
                <p></p>
                <ul class="score-report">
                    <li class="personal-info">
                        <h2 class="name">
                            {`${currentUser.firstName} ${currentUser.lastName}`}
                        </h2>
                        <h3 class="test-date">
                            Test Date: Ngày {day.getDate()} Tháng {day.getMonth()} Năm {day.getFullYear()}
                        </h3>
                    </li>
                    <li class="component-scores">
                        <div class="listening-score-wrapper">
                            <div class="score-label">LISTENING</div>
                            <div class="score-value">{diemListen}</div>
                        </div>
                        <div class="reading-score-wrapper">
                            <div class="score-label">READING</div>
                            <div class="score-value">{diemReading}</div>
                        </div>
                    </li>
                    <li class="total-score">
                        <div class="score-label">TOTAL SCORE</div>
                        <div class="score-value total-score">{diemListen + diemReading}</div>
                    </li>
                </ul>
            </div>
            <div className='test-form'>
                <button className="pay" onClick={()=>payorSee()}><h1 className="payclick" ><ContainerOutlined />Click Để xem trọn bộ câu trả lời</h1></button>
                <h1 className='zero'>KẾT QUẢ</h1>
                <h1 className='first'>ĐỀ THI THỬ TOEIC</h1>
                <h1 className="second">Thời gian làm bài: 120 phút</h1>
                {/* <h1 className='third'>Đồng hồ ở gốc màn hình bạn nhé!</h1> */}
                <h1>LISTENING TEST </h1>
                <h2> In the Listening test, you will be asked to demonstrate how well you understand spoken English. The entire Listening test will last approximately 45 minutes. </h2>
                <h2>There are four parts, and directions are given for each part. </h2>
                <h2>You must mark your answers on the separate answer sheet. Do not write your answers in your test book.</h2>
                <h2>PART 1</h2>
                {loadQues(1)}
                <h2>PART 2</h2>
                {loadQues(2)}
                <h2>PART 3</h2>
                {loadQues(3)}
                <h2>PART 4</h2>
                {loadQues(4)}
                <h1>READING TEST</h1>
                <h2>In the Reading test, you will read a variety of texts and answer several different types of reading comprehension questions. The entire Reading test will last 75 minutes.</h2>
                <h2>There are three parts, and directions are given for each part. You are encouraged to answer as many questions as possible within the time allowed.</h2>
                <h2>You must mark your answers on the separate answer sheet. Do not write your answers in the test book.</h2>
                <h2>PART 5</h2>
                {loadQues(5)}
                <h2>PART 6</h2>
                {loadQues(6)}
                <h2>PART 7</h2>
                {loadQues(7)}
                {/* <Button onClick={() => submitAll()} >Nộp Bài</Button>
            <CountdownTimer/> */}
            </div>

        </>
    )
}

export default withRouter(Index) 
