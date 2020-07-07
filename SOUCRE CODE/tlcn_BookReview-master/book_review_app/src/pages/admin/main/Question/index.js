import React, { useState, useEffect } from 'react'
import { Table, Divider, Tag, Input, Icon, notification, Form, Skeleton, Button, Popconfirm, Modal, Popover } from 'antd'
import axios from 'axios'
import Swal from 'sweetalert2'
import './index.scss'
import PlayAudio from 'react-simple-audio-player'
import CreateQu from './createQu'
import { withRouter } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined ,CaretDownOutlined } from '@ant-design/icons';
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
    useEffect(() => {
        loadData()

    }, [])

    const deleteHandler = (id) => {
        console.log(id)
        axios({
            method: "delete",
            url: `http://localhost:8080/reviewbook/question/${id}?token=${localStorage.getItem('tokenAdmin') ? localStorage.getItem('tokenAdmin') : 'shit'}`
    
        }).then((res) => {
            loadData()
        })

    }
    const datta = [{ "name": "test1" }, { "name": "test2" }];
    const listItems = datta.map((d) => <li key={d.name}>{d.name}</li>);
    const showModal = () => {
        console.log(datap)
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
            url: `http://localhost:8080/reviewbook/allques?token=${localStorage.getItem('tokenAdmin')}`,
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
            console.log(1)
            console.log(data)
            setLoadingData(false)
        })
    }

    const ComplexList = (option) => (
        <ul>
            {option.map(item => (
                <li key={item.content}>
                    <div>{item.content}</div>
                    <div>{item.a}</div>
                    <div>{item.b}</div>
                    <div>{item.c}</div>
                    <div>{item.d ? (item.d.length > 0 && item.d) : 'Chưa xác định'}</div>
                    <div>{item.answer}</div>
                </li>
            ))}
        </ul>
    );
    const demoImage = (image) => {
        Swal.fire({
            imageUrl: image,
        })
    }
    const Click = (option) => {
        //console.log(datta)

        console.log(option)
    }
    const columns = [
        {
            title: '#',
            dataIndex: 'stt',
            key: 'stt',
            render: text => <p>{text}</p>,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (src) => {
                return <img onClick={() => demoImage(src)} className='img_row' src={src.length > 0 ? src : 'https://shadow888.com/images/default/noimagefound.png'} />
            },
        },
        {
            title: 'Âm thanh',
            dataIndex: 'audio',
            key: 'audio',
            render: (src) => {
                return <PlayAudio className='audio_row' url={src} />
            },
        },
        // {
        //     title: 'Nội dung',
        //     dataIndex: 'cont',
        //     key: 'cont',
        //     render: (cont) => <p style={{ wordWrap: "break-word", wordBreak: 'break-word', maxHeight: '10em' }}>{cont.substring(0, 40)}</p>
        // },
        {
            title: 'Ngày đăng',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Part',
            dataIndex: 'part',
            key: 'part',
            filters: [
                { text: '1', value: '1' },
                { text: '2', value: '2' },
                { text: '3', value: '3' },
                { text: '4', value: '4' },
                { text: '5', value: '5' },
                { text: '6', value: '6' },
                { text: '7', value: '7' }
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.part.indexOf(value) === 0,
            sorter: (a, b) => a.part - b.part,
            sortDirections: ['descend'],
            render:
                text => (

                    <Tag color={'magenta'} >
                        {text}
                    </Tag>
                ),
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'a',
            key: 'a',
            render: (a) => (
                <Popover
                    content={
                        <ol>
                            {[...Object.values(a)].map(item => (
                                <li key={item.id}>
                                    {item.content}
                                    <ul>
                                        <li>{item.a}</li>
                                        <li>{item.b}</li>
                                        <li>{item.c}</li>
                                        <li>{item.d}</li>
                                    </ul>
                                </li>
                            ))}
                        </ol>
                    }
                    title="Title">
                    <Button type="primary" onClick={() => Click(a)}>Xem Câu Hỏi<CaretDownOutlined /></Button>
                </Popover>
            )

        },
        {
            title: 'Thẻ',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
                <span>
                    {tags.map((tag, i) => {
                        let color = 'green';
                        return (
                            <Tag color={color} key={i}>
                                {tag}
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'id',
            render: (id) => (
                <span>
                    <Popconfirm
                        title="Bạn có chắc muốn xoá chứ?"
                        onConfirm={() => deleteHandler(id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a style={{ color: 'red' }}>Xoá</a>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <>
            <Button style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => loadData()} type='primary'  >Refresh</Button>
            <div>
                <Button type="primary" style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => showModal()}>
                <PlusOutlined /> Tạo Câu hỏi
        </Button>
        
                
                {/* <Modal

                    title="Basic Modal"
                    visible={visible}
                    onOk={() => handleOk()}
                    onCancel={() => handleCancel()}
                >
                    <Form className="create-form">
                        <Form.Item>
                            
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="part"
                                   
                                />,
                            
                        </Form.Item>

                    </Form>
                </Modal> */}
                 <CreateQu
                     visible={visible}
                     onCancel={() => handleCancel()}
                     params={props.params}
                     onConfirm={()=>loadData()}
                     />
            </div>
         <Table pagination={{ pageSize: 6 }} columns={columns} dataSource={data} loading={loadingData} />
           
        </>
    )
}

export default Index

