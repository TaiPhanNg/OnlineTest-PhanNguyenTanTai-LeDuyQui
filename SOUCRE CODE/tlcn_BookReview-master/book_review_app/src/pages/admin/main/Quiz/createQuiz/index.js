import React, { useEffect, useState, useRef } from 'react'
import { Button, Divider, Avatar, Input, Upload, Icon, message, Spin, Modal, Form, Select,Space, Switch,DatePicker } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import css
import './index.scss'
//import firebase
import { uploadImage, uploadAudio } from '../../../../../firebase/my-firebase2'
import axios from 'axios'
import PlayAudio from 'react-simple-audio-player'
//redux
import { useDispatch } from 'react-redux'
// import { setUserPost } from '../../../../actions/userPost/setUserPost'
// import { setQues } from '../../../../actions/posts/setQues'
const { Option } = Select
const { TextArea } = Input
const Index = (props) => {

  const { visible, onCancel ,onConfirm} = props
  const [isLoading, setIsLoading] = useState(false)
  const [kind, setKind]=useState('')
  const [active, setActive]=useState('')
  const [dateStart,setDateStart ]= useState('')
  const [role, setRole]= useState('')
  const [posting ,setPosting]= useState(false)
  const dispatch = useDispatch()
  
  const checkOut=()=>{
   console.log(dateStart)
  }

  function onChange(date,dateString){
      console.log(dateString)
      setDateStart(dateString)
  }
  
  const saveQuesHandler = () => {
    //window.document.querySelector('.text').value = ''
    //window.document.querySelector('[name="kind"]').value = ''
    setPosting(true)
    axios({
      method: 'post',
      url: `http://localhost:8080/reviewbook/quiz/post/?token=${localStorage.getItem('tokenAdmin')}`,
      data: {
          kind,
          dateStart,
          active,
          role
       
      }
    }).then(() => {
      axios({
        method: 'get',
        url: `http://localhost:8080/reviewbook/allquiz?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      console.log("thanh cong")
      setKind('')
      setActive('')
      setDateStart('')
      setRole('')
      setPosting(false)
      onCancel()
    })
    })

  }
  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => onCancel()}
        footer={null}
        width='556px'
        className='createquiz-form'
        onFinish={()=>onConfirm()}
      >
        <Spin
          spinning={posting}
        >
          <div className='createquiz'>
            <Spin tip="Dang Luu..."
              spinning={false}
            >
              <div className='top-bar'>
                <h3 style={{ marginBottom: 0 }}>Thêm Bộ Đề</h3>
                <a className='close-button' style={{ marginRight: 'auto', marginBottom: 0, float: 'right' }}>x</a>
              </div>
              <Divider style={{ margin: '10px 0 20px 0' }} />
              <div className='main'>

                {/* <TextArea
                  name='kind'
                  setfieldvalue={'kind'}
                  className='text'
                  placeholder='Thể loại Test'
                  autoSize={{ minRows: 1, maxRows: 50 }}
                  style={{ borderColor: 'transparent', fontSize: '18px' }}
                  onChange={(e) => setCont(e.target.value)}
                /> */}
              </div>
              <div>
                <div className='bottom-bar'>
                  <div className='tool-bar'>
                    

                    <div className='input-form'>
                      <p style={{ marginBottom: '5px', color: '#B8BCBC' }}>Tạo Mã Bộ Đề</p>
                      <h4>Role Test cho Users</h4>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn Role "
                        optionFilterProp="children"
                        onChange={(e) => setRole(e)}
                      >
                        <Option value="normal">Normal</Option>
                        <Option value="premier">Premier</Option>
                      </Select>
                     
                      <h4>Loại</h4>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn Loại bài test"
                        optionFilterProp="children"
                        onChange={(e) => setKind(e)}
                      >
                        <Option value="toeic">Offical Test</Option>
                        <Option value="250-500">Training Test 250-500</Option>
                        <Option value="500-700">Training Test 500-700</Option>
                        <Option value="700-900">Training Test 700-900</Option>
                        <Option value="promo">Promo Test</Option>
                       
                      </Select>
                      <Switch checkedChildren="true" unCheckedChildren="false" onChange={()=>setActive()} defaultChecked />
                      <DatePicker onChange={onChange} showTime/>
                    </div>
                  </div>
                  <h4> Note: Nhớ kiểm tra trước khi Lưu</h4>
                  {
                    
                      <Button type='primary' style={{ display: 'block', width: '100%' }} onClick={() => saveQuesHandler()}>Lưu</Button>
                    
                  }

                </div>
                <div>

                </div>
                <Button onClick={() => checkOut() } >
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