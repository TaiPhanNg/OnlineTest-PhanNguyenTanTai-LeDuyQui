import React, { useEffect, useState, useRef } from 'react'
import { Button, Divider, Avatar, Input, Upload, Icon, message, Spin, Modal, Form, Select, Radio, Tag, Popover, Table } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined, CaretDownOutlined } from '@ant-design/icons';
import PlayAudio from 'react-simple-audio-player'
import Swal from 'sweetalert2'
// import css
import './index.scss'
//import firebase
import { uploadImage, uploadAudio } from '../../../../../firebase/my-firebase2'
import axios from 'axios'
const { Option } = Select
const { TextArea } = Input
const Index = (props) => {
  const { visible, onCancel, onConfirm, idQuiz } = props
  const [loadingData, setLoadingData] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [idQues, setIdQues] = useState('')
  const [list, setList] = useState([])
  const [posting, setPosting] = useState(false)
  const [data, setData] = useState([])
  const [dataquiz, setDataQuiz] = useState('')
  const [selectionType, setSelectionType] = useState('checkbox');
  useEffect(() => {
    loadData()
    loadListQq()
  }, [])
  const checkOut = () => {

    console.log(idQuiz)
  }
  const loadListQq = () => {
    setLoadingData(true)
    axios({
      method: 'get',
      url: `http://localhost:8080/reviewbook/qq/${idQuiz}?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      let arra = []
      let list = []
      try {
        Object.values(res.data).map((v, i) => {
          let value = Object.values(v)[0]
          arra.push({
            id: Object.keys(v)[0],
          })
        })

      } catch (err) {
        arra = []
      }
      setList([...arra])
      setLoadingData(false)
    })
  }
  const demoImage = (image) => {
    Swal.fire({
      imageUrl: image,
    })
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setIdQues(selectedRowKeys)
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
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
  const Click = (option) => {
    //console.log(datta)

    console.log(option)
  }
  const saveQuesHandler = () => {
    if (list.indexOf(idQues)) {
      console.log('trùng')
    }
    //window.document.querySelector('.text').value = ''
    //window.document.querySelector('[name="kind"]').value = ''
    setPosting(true)
    axios({
      method: 'post',
      url: `http://localhost:8080/reviewbook/qq/${idQuiz}/${idQues}?token=${localStorage.getItem('tokenAdmin')}`,
    }).then(() => {
      axios({
        method: 'get',
        url: `http://localhost:8080/reviewbook/qq/${idQuiz}?token=${localStorage.getItem('tokenAdmin')}`,
      }).then((res) => {
        console.log("thanh cong")
        setIdQues('')
        setPosting(false)
        onCancel()
      })
    })

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
  ];

  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => onCancel()}
        footer={null}
        width='1000px'
        className='edit-form'
        onFinish={() => onConfirm()}
      >
        <Spin
          spinning={posting}
        >
          <div className='createqq'>
            <Spin tip="Dang Luu..."
              spinning={false}
            >
              <div className='top-bar'>
                <h3 style={{ marginBottom: 0 }}>Soạn Đề</h3>
                <a className='close-button' style={{ marginRight: 'auto', marginBottom: 0, float: 'right' }}>x</a>
              </div>
              <Divider style={{ margin: '10px 0 20px 0' }} />
              <div className='main'>
              </div>
              <div>
                <div className='bottom-bar'>
                  <div className='tool-bar'>
                    <div className='input-form'>
                      <p style={{ marginBottom: '5px', color: '#B8BCBC' }}>Soạn Đề</p>
                      <div>
                        <Radio.Group
                          onChange={({ target: { value } }) => {
                            setSelectionType(value);
                          }}
                          value={selectionType}
                        >
                          <Radio value="checkbox">Checkbox</Radio>
                          <Radio value="radio">radio</Radio>
                        </Radio.Group>

                        <Divider />

                        <Table
                          rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                          }}
                          columns={columns}
                          dataSource={data}
                        />
                      </div>

                    </div>
                  </div>
                  <h4> Note: Nhớ kiểm tra trước khi Lưu</h4>
                  {
                    <Button type='primary' style={{ display: 'block', width: '100%' }} onClick={() => saveQuesHandler()}>Lưu</Button>
                  }
                </div>
                <div>

                </div>
                <Button onClick={() => checkOut()} >
                  Kiểm Tra
                </Button>
              </div>
            </Spin>
          </div>

        </Spin>
      </Modal>
    </>
  )
}
export default Index