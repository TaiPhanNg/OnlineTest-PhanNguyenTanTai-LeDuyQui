import React, { useState, useEffect, } from 'react'
import { Radio, Table, Divider, Tag, Input, Icon, notification, Empty, Form, Skeleton, Button, Popconfirm, Modal, Popover, Card, Avatar } from 'antd'
import axios from 'axios'
import Swal from 'sweetalert2'
import './index.scss'
import PlayAudio from 'react-simple-audio-player'
import { withRouter } from "react-router-dom";


import { MinusCircleOutlined, PlusOutlined, CaretDownOutlined, SettingOutlined } from '@ant-design/icons';
//import Modal from "./Modal";
//import useModal from './useModal';
function Index(props) {
    const {
        user,
        id,
        content,
        option,
        image,
        urlImage,
        audio,
        urlAudio,
        part

    } = props;
    const [data, setData] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    //const { isShowing, toggle } = useModal();
    const [visible, setVisible] = useState(false)
    const [submit, setSubmit] = useState(false)
    const { idQuiz } = props.match.params
    const listAnswertmp = []//bo cau tra loi
    const listAnswer = []
    var diemListen = 0
    var diemReading = 0
    useEffect(() => {
        loadData()

    }, [])

    var num = 0
    const datta = [{ "name": "test1" }, { "name": "test2" }];
    var finalStt = 0;
    const listItems = datta.map((d) => <li key={d.name}>{d.name}</li>);
    const showModal = () => {
        setVisible(true)
        console.log(visible)
    };
    const handleOk = e => {
        setVisible(false)
    }
    const handleCancel = e => {
        setVisible(false)
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
    const loadAnswer = (answer, id) => {
        //setNum(num)

        listAnswertmp.push(

            answer

        )
        console.log(listAnswertmp)
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
        var x =now
        alert("Ngày hôm nay: " + now);
//.find(v=>
        props.
            history.push({
                pathname: '/result',
                state: {
                    idQuiz: idQuiz,
                    diemListen:diemListen,
                    diemReading:diemReading,
                    day:x,
                    listAnswer:listAnswer,
                    listAnswertmp:listAnswertmp
                }
            })
           
    //       v.id===1
    //   ))
}
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
    tinhDiemDoc(rd)
    tinhDiemNghe(ls)

}
const tinhDiemNghe = (x) => {
    if (x <= 5) {
        diemListen = 5
    }
    else if (x > 5 && x < 93) {
        diemListen = (5 * (x - 5))
    }
    else (
        diemListen = 495
    )
    console.log('diem listen' + ' ' + diemListen)
}
const tinhDiemDoc = (x) => {
    if (x <= 8) {
        diemListen = 5
    }
    else if (x > 8 && x < 97) {
        diemReading = (5 * (x - 5))
    }
    else (
        diemReading = 495
    )
    console.log('diem Reading' + ' ' + diemReading)
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
                        loadAnswer(v.answer, stt, part)

                        return <div key={i}>
                            <h3>{stt}</h3>
                            <p>{v.content}</p>
                            <Radio.Group name={stt} onChange={(e) => onChange(e, crAnswer, part)}>
                                <Radio style={radioStyle} name={stt} value={v.a}>
                                    (A) {v.a}
                                </Radio>
                                <Radio style={radioStyle} name={stt} value={v.b}>
                                    (B) {v.b}
                                </Radio>
                                <Radio style={radioStyle} name={stt} value={v.c}>
                                    (C) {v.c}
                                </Radio>
                                {v.d && (
                                    <Radio style={radioStyle} name={stt} value={v.d}>
                                        (D) {v.d}
                                    </Radio>
                                )}

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
const demoImage = (image) => {
    Swal.fire({
        imageUrl: image,
    })
}


return (
    <>

        {/* <Button style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => loadData()} type='primary'  >Refresh</Button> */}
        <div>
            {/* <Button type="primary" style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => showModal()}>
                <PlusOutlined /> Tạo Câu hỏi
        </Button> */}
            <div>

            </div>


        </div>

        <div className='test-form'>
            <h1 className='first'>ĐỀ THI THỬ TOEIC</h1>
            <div>
            <h1>LISTENING TEST </h1>
                <Button>Part 1: Mô tả hình ảnh</Button>
                <Button>Part 2: Hỏi & Đáp </Button>
                <Button>Part 3: Đoạn hội thoại </Button>
                <Button>Part 4: Bài nói chuyện</Button>
            </div>
            <div>
                <h1>READING TEST</h1>
                <Button>Part 5: Điền vào câu</Button>
                <Button>Part 6: Điền vào đoạn</Button>
                <Button>Part 7: Đọc hiểu</Button>
            </div>
            {/* <h1 className="second">Thời gian làm bài: 120 phút</h1>
            <h1 className='third'>Đồng hồ ở gốc màn hình bạn nhé!</h1>
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
            {loadQues(7)} */}
            <Button onClick={() => submitAll()} >Nộp Bài</Button>
            {/* <CountdownTimer/> */}
        </div>

    </>
)
}

export default withRouter(Index)

