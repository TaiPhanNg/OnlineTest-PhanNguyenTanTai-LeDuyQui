import React, { useState, useEffect } from 'react'
import { Table, Divider, Tag, notification, Skeleton, Button, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import Swal from 'sweetalert2'
import './index.scss'
import CreateQuiz from './createQuiz'
import EditForm from './Edit'
function Index(props) {
  const [data, setData] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [visible, setVisible] = useState(false)
  const [edit, setEdit] = useState(false)
  const [idQuiz, setIdQuiz] = useState('')
  useEffect(() => {
    loadData()
  }, [])
  const showModal = () => {
    setVisible(true)
    console.log(idQuiz)
  };
  const showEdit = (id) => {
    setIdQuiz(id)
    console.log(id)
    setEdit(true)
  }
  const handleOk = e => {
    setVisible(false)
  }
  
  const handleCancel = e => {
    setVisible(false)
    setEdit(false)
  }
  const deleteHandler = (id) => {
    axios({
      method: "delete",
      url: `http://localhost:8080/reviewbook/quiz/${id}?token=${localStorage.getItem('tokenAdmin') ? localStorage.getItem('tokenAdmin') : 'shit'}`
    }).then((res) => {
      loadData()
    })

  }
  const loadData = () => {
    setLoadingData(true)
    axios({
      method: 'get',
      url: `http://localhost:8080/reviewbook/allquiz?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      let arr = []
      try {
        Object.values(res.data).map((v, i) => {
          let value = Object.values(v)[0]
          arr.push({
            key: Object.keys(v)[0],
            id: Object.keys(v)[0],
            stt: i + 1,
            kind: value.kind,
            dates: value.dateStart,
            time: value.dateCreate,
            active: value.active ? (value.active.length > 0 && value.active) : 'Chưa xác định',
            role: value.role ? (value.role.length > 0 && value.role) : 'Chưa xác định',
            tags: ['Quiz đã được thông qua']
          })
        })
      } catch (err) {
        arr = []
      }
      setData([...arr])
      setLoadingData(false)
    })
  }
  const demoImage = (image) => {
    Swal.fire({
      imageUrl: image,
    })
  }
  const columns = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
      render: text => <p>{text}</p>,
    },
    // {
    //   title: 'Hình ảnh',
    //   dataIndex: 'image',
    //   key: 'image',
    //   render: (src) => {
    //     return <img onClick={() => demoImage(src)} className='img_row' src={src.length > 0 ? src : 'https://shadow888.com/images/default/noimagefound.png'} />
    //   },
    // },
    {
      title: 'Loại',
      dataIndex: 'kind',
      key: 'kind',
      render: (kind) => <Tag color={'magenta'} ><p style={{ wordWrap: "break-word", wordBreak: 'break-word', maxHeight: '10em' }}>{kind.substring(0, 40)}</p></Tag>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'dates',
      key: 'dates',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: text => (
        <Tag color={'magenta'} >
          {text}
        </Tag>
      ),
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
    {
      title: 'edit',
      key: 'edit',
      dataIndex: 'id',
      render: (id) => (
        <Button type="primary" style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => showEdit(id)}>
          <PlusOutlined />Soạn Đề Thi
        </Button>

      )
    }
  ];

  return (
    <>
      <Button style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => loadData()} type='primary'>Refresh</Button>
      <Button type="primary" style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => showModal()}>
        <PlusOutlined /> Tạo bộ Đề
        </Button>
      <Table pagination={{ pageSize: 6 }} columns={columns} dataSource={data} loading={loadingData} />

      <CreateQuiz
        visible={visible}
        onCancel={() => handleCancel()}
        params={props.params}
        onConfirm={() => loadData()}
      />
      <EditForm
        visible={edit}
        idQuiz ={idQuiz}
        onCancel={() => handleCancel()}
        params={props.params}
        onConfirm={() => loadData()}
      />
      
    </>
  )
}

export default Index
