import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import {
     Button, Modal, Form,
    Input, Select
} from 'antd';
import { Option } from 'antd/lib/mentions';
import {  getProfile, updateStudents } from '../../redux/action/actStudent';
const Profile = () => {
    const dispatch = useDispatch();
    const listDepartmentFromStore = useSelector((state) => state.departments);
    const profileFromstore = useSelector(state => state.profile)
    console.log(profileFromstore)
    const [isNeedRerender, setisNeedRerender] = useState(false)
   
    useEffect(() => {
        const username = sessionStorage.getItem("username");
        dispatch(getProfile(username))
        
    }, [isNeedRerender, dispatch])
    
    const onFormSubmit = (obj) =>{
        dispatch(updateStudents(obj))
        .then(() =>{
            
            Modal.success({
                content: 'Cập nhật thành công',
              });
            setisNeedRerender(true)
            setisNeedRerender(false)

        })
    }
    return (
        <div className='row'>
          <div className='col-10' style={{ marginTop: "50px" }}>
               
               <h4 className='text-center'><strong > THÔNG TIN CÁ NHÂN: </strong></h4>
            {typeof profileFromstore._id !== 'undefined' ? <Form id="detailForm"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 20 }}
                    layout="horizontal"
                     initialValues ={profileFromstore}
                    
                    onFinish={onFormSubmit}
                >


                    <Form.Item label="ID :" name="_id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Họ và tên:" name="name"
                        rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                        hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tài khoản" name="username"
                        rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                        hasFeedback>

                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Role" name="role"
                        rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                        hasFeedback>

                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="MSSV" name="mssv"
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item label="Lớp" name="class"
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item label="Khoa" name="department"  >
                        <Select name="department" style={{ width: '100%' }}  >
                            {


                                listDepartmentFromStore.map((department, id) => {
                                    return <Option key={id} value={department._id}>{department.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description"
                    >

                        <Input.TextArea />

                    </Form.Item>

                    
                    <div className='text-center'>
                        <Button type='primary' htmlType="submit">Lưu</Button>
                    </div>


                </Form> : <Form id="detailForm"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 20 }}
                    layout="horizontal"
                    //  initialValues ={profileFromstore}
                    
                    onFinish={onFormSubmit}
                >


                    <Form.Item label="ID2 :" name="_id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Họ và tên:" name="name"
                        rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                        hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tài khoản" name="username"
                        rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                        hasFeedback>

                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Role" name="role"
                        rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                        hasFeedback>

                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="MSSV" name="mssv"
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item label="Lớp" name="class"
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item label="Khoa" name="department"  >
                        <Select name="department" style={{ width: '100%' }}  >
                            {


                                listDepartmentFromStore.map((department, id) => {
                                    return <Option key={id} value={department._id}>{department.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description"
                    >

                        <Input.TextArea />

                    </Form.Item>

                    
                    <div className='text-center'>
                        <Button type='primary' htmlType="submit">Lưu</Button>
                    </div>


                </Form>}
            </div> 
        </div>
    )
}

export default Profile
