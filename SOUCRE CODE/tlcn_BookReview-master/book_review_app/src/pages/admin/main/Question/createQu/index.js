import React, { useEffect, useState, useRef } from 'react'
import { Button, Divider, Avatar, Input, Upload, Icon, message, Spin, Modal, Form, Select,Space } from 'antd'
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
  const [urlImage, setUrlImage] = useState('')
  const [image, setImage] = useState('')
  const [cont, setCont] = useState('')
  const [part, setPart] = useState('')
  const [urlAudio, setUrlAudio] = useState('')
  const [audio, setAudio] = useState('')
  const [option, setOption] = useState('')
  const [posting, setPosting] = useState(false)
  const dispatch = useDispatch()
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 4
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }
  const checkOut=()=>{
    console.log(cont)
    console.log(part)
    console.log(image)
    console.log(urlImage)
    console.log(audio)
    console.log(urlAudio)
    console.log(option)
  }
  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  const onFinish = values => {
    try{
      setOption(values.users)   
    }
    catch(e){
      console.log('error',e);
    }
   console.log('Received values of form:', values);
  };
  const handleChange2 = async info => {
    if (info.file.status === 'uploading') {
      setUrlAudio('')
      setIsLoading(true)
      return
    }
    if (info.file.status === 'done') {
      let audi = await uploadAudio(info.file.originFileObj)
      setUrlAudio(audi.url)
      setAudio(audi.nameImage)
      getBase64(info.file.originFileObj, imageUrl => {
        setIsLoading(false)
        setUrlAudio(imageUrl)
      }
      )
    }

  }
  const handleChange = async info => {
    if (info.file.status === 'uploading') {
      setUrlImage('')
      setIsLoading(true)
      return
    }
    if (info.file.status === 'done') {
      let img = await uploadImage(info.file.originFileObj)
      setUrlImage(img.url)
      setImage(img.nameImage)
      console.log(img.image)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setIsLoading(false)
        setUrlImage(imageUrl)
      }
      )
    }
  }
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const uploadButton = (
    <div>
      <Icon type={isLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  )
  const saveQuesHandler = () => {
    window.document.querySelector('.text').value = ''
    window.document.querySelector('[name="cont"]').value = ''
    console.log(cont)
    console.log(option)
    setPosting(true)
    axios({
      method: 'post',
      url: `http://localhost:8080/reviewbook/question/post/?token=${localStorage.getItem('tokenAdmin')}`,
      data: {
        cont,
        part,
        option,
        image,
        urlImage,
        audio,
        urlAudio
      }
    }).then(() => {
      axios({
        method: 'get',
        url: `http://localhost:8080/reviewbook/allques?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      console.log("thanh cong")
      setAudio('')
      setUrlAudio('')
      setCont('')
      setImage('')
      setOption('')
      setPart('')
      setUrlImage('')
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
          <div className='createques'>
            <Spin tip="Dang Luu..."
              spinning={false}
            >
              <div className='top-bar'>
                <h3 style={{ marginBottom: 0 }}>Thêm Câu Hỏi</h3>
                <a className='close-button' style={{ marginRight: 'auto', marginBottom: 0, float: 'right' }}>x</a>
              </div>
              <Divider style={{ margin: '10px 0 20px 0' }} />
              <div className='main'>

                <TextArea
                  name='cont'
                  setfieldvalue={'cont'}
                  className='text'
                  placeholder='Nội dung câu (nếu có)'
                  autoSize={{ minRows: 1, maxRows: 50 }}
                  style={{ borderColor: 'transparent', fontSize: '18px' }}
                  onChange={(e) => setCont(e.target.value)}
                />
              </div>
              <div>
                <div className='bottom-bar'>
                  <div className='tool-bar'>
                    <h4>Ảnh câu hỏi</h4>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {urlImage ? <img src={urlImage} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                    <h4>Nội dung Nghe</h4>
                    <Upload
                      name="audio"
                      listType="picture-card"
                      className="audio-uploader"
                      showUploadList={false}
                      customRequest={dummyRequest}
                      // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                     
                      onChange={handleChange2}
                    >
                      {urlAudio ? <PlayAudio className='audio_row' style={{ width: '100%' }} url={urlAudio} /> : uploadButton}
                    </Upload>
                      {urlAudio && <audio controls> <source src={urlAudio} type="audio/mpeg" /></audio>}
                    <div className='input-form'>
                      <p style={{ marginBottom: '5px', color: '#B8BCBC' }}>...</p>
                      {/* <Input placeholder='Tiêu đề...'
                        onChange={(e) => set(e.target.value)}
                        setfieldvalue={}
                        name='title' /> */}
                      <h4>Nội dung Câu hỏi và câu trả lời</h4>
                      <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                        <Form.List name="users">
                          {(fields, { add, remove }) => {
                            return (
                              <div>
                                {fields.map(field => (
                                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'content']}
                                      fieldKey={[field.fieldKey, 'content']}
                                      rules={[{ required: true, message: 'Missing content' }]}
                                    >
                                      <Input placeholder="Content" />
                                    </Form.Item>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'a']}
                                      fieldKey={[field.fieldKey, 'a']}
                                      rules={[{ required: true, message: 'Missing a' }]}
                                    >
                                      <Input placeholder="A" />
                                    </Form.Item>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'b']}
                                      fieldKey={[field.fieldKey, 'b']}
                                      rules={[{ required: true, message: 'Missing b' }]}
                                    >
                                      <Input placeholder="B" />
                                    </Form.Item>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'c']}
                                      fieldKey={[field.fieldKey, 'c']}
                                      rules={[{ required: true, message: 'Missing c' }]}
                                    >
                                      <Input placeholder="C" />
                                    </Form.Item>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'd']}
                                      fieldKey={[field.fieldKey, 'd']}
                                      rules={[{ required: false, message: 'Missing d' }]}
                                    >
                                      <Input placeholder="D" />
                                    </Form.Item>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'answer']}
                                      fieldKey={[field.fieldKey, 'answer']}
                                      rules={[{ required: true, message: 'Missing answer' }]}
                                    >
                                      <Input placeholder="Answer" />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                      onClick={() => {
                                        remove(field.name);
                                      }}
                                    />
                                  </Space>
                                ))}

                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => {
                                      add();
                                    }}
                                    block
                                  >
                                    <PlusOutlined /> Thêm câu
                </Button>
                                </Form.Item>
                              </div>
                            );
                          }}
                        </Form.List>

                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Xác nhận câu hỏi cần có
        </Button>
                        </Form.Item>
                      </Form>
                      <h4>Phần</h4>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn Part"
                        optionFilterProp="children"
                        onChange={(e) => setPart(e)}
                      >
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                      </Select>
                    </div>
                  </div>
                  <h4> Note: Nhớ kiểm tra trước khi Lưu</h4>
                  {
                    
                      <Button type='primary' style={{ display: 'block', width: '100%' }} onClick={() => saveQuesHandler()}>Lưu</Button>
                    
                  }
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