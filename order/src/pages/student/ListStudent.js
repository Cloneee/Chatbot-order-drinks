import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import {
    Table, Tag, Button, Modal, Form,
    Input, Select,
} from 'antd';
import { addStudent, getstudentById, getStudents, updateStudents, } from '../../redux/action/actStudent';
import { Option } from 'antd/lib/mentions';
const ListStudent = () => {
    const dispatch = useDispatch();
    const studentFromStore = useSelector((state) => state.studentById);
    const listStudentFromStore = useSelector((state) => state.students);
    const [isNeedRerender, setisNeedRerender] = useState(false)
    useEffect(() => {
        dispatch(getStudents())
    }, [isNeedRerender, dispatch])
    const columns = [
        {
            title: 'Facebook ID',
            dataIndex: 'fbid',
            key: 'fbid',
            render: text => <strong>{text}</strong>,
        },
        {
            title: 'Drinks',
            dataIndex: 'drink',
            key: 'drink',
            render: obj => {
                return obj.map(drink => <div>- {drink}</div>)
            }
        },

        {
            title: 'Topping',
            dataIndex: 'topping',
            key: 'topping',
            render: obj => {
                return obj.map(drink => <div>- {drink}</div>)
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: 'Ngày giao',
            dataIndex: 'datetime',
            key: 'datetime',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: tag => {
                if (tag === 'Nhận đơn') return (<Tag color='red' key={tag}>
                    {(tag + "").toUpperCase()}
                </Tag>)
                else return (<Tag color='green' key={tag}>
                    {(tag + "").toUpperCase()}
                </Tag>)
            }
        }

    ]

    //Add Modal
    const [isShowAddModal, setisShowAddModal] = useState(false)

    const handleCancelAddModal = () => {

        setisShowAddModal(false)
    };
    const showModalAdd = (supplier) => {
        setisShowAddModal(true)
    };
    const onFormSubmitAddModal = (values) => {

        console.log(values)
        dispatch(addStudent(values))
            .then(() => {
                setisShowAddModal(false)
                Modal.success({
                    content: 'Thêm thành công',
                });
                setisNeedRerender(true)
                setisNeedRerender(false)
            })
            .catch(err => {
                setisShowAddModal(false)
                Modal.success({
                    content: 'Thêm thất bại',
                });
                setisNeedRerender(true)
                setisNeedRerender(false)
            })
    };
    const footerOfAddModal = [
        <Button key="back" onClick={() => handleCancelAddModal()}>

            Thoát
        </Button>,

        <Button form="AddForm" icon={<i className="fas fa-save"></i>}
            type="primary"
            key="submit" htmlType="submit"
        >
            &nbsp;Thêm sản phẩm
        </Button>]

    //show modal

    const [isShowDetailModal, setisShowDetailModal] = useState(false)



    const handleCancel = () => {
        setisShowDetailModal(false)
    };
    const showDetailModal = (obj) => {
        dispatch(getstudentById(obj.username))
            .then(() => {
                setisShowDetailModal(true)

            })


    }

    const footerOfDetailModal = [
        <Button key="back" onClick={() => handleCancel()}>

            Thoát
        </Button>,

        <Button form="detailForm" icon={<i className="fas fa-save"></i>}
            type="primary"
            key="submit" htmlType="submit"
        >
            &nbsp;Lưu thay đổi
        </Button>]
    const onFormSubmit = (obj) => {
        console.log(obj)
        dispatch(updateStudents(obj))
            .then(() => {
                setisShowDetailModal(false)
                Modal.success({
                    content: 'Cập nhật thành công',
                });
                setisNeedRerender(true)
                setisNeedRerender(false)


            })
            .catch(err => {
                setisShowDetailModal(false)
                Modal.error({
                    content: 'Cập nhật thất bại',
                });
                setisNeedRerender(true)
                setisNeedRerender(false)

            })
    }
    return (
        <div>

            <Table style={{ marginTop: '15px' }} rowKey="id" columns={columns} pagination={false} scroll={{ y: 750 }} dataSource={listStudentFromStore} />

            {isShowAddModal && <Modal closable={false}
                style={{ top: 20 }}
                title={<strong>Thêm sản phẩm</strong>}
                visible={isShowAddModal}
                footer={footerOfAddModal}
            >
                <div>


                    <Form id="AddForm"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 20 }}
                        layout="horizontal"
                        onFinish={onFormSubmitAddModal}
                    >





                        <Form.Item label="Họ và tên:" name="name"
                            rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                            hasFeedback>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Tài khoản" name="username"
                            rules={[{ required: true, message: "Thuộc tính này là bắt buộc!" },]}
                            hasFeedback>

                            <Input />
                        </Form.Item>
                        <Form.Item label="Role" name="role"  >
                            <Select name="role" style={{ width: '100%' }}  >
                                {


                                    ['admin', 'student'].map((department, id) => {
                                        return <Option key={id} value={department}>{department}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="MSSV" name="mssv"
                        >

                            <Input />
                        </Form.Item>
                        <Form.Item label="Lớp" name="class"
                        >

                            <Input />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description"
                        >

                            <Input.TextArea />

                        </Form.Item>






                    </Form>
                </div>
            </Modal>}
            {isShowDetailModal && <Modal closable={false}
                style={{ top: 20 }}
                title={<strong>Thông tin sinh viên</strong>}
                visible={isShowDetailModal}
                footer={footerOfDetailModal}
            >
                <div>


                    <Form id="detailForm"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 20 }}
                        layout="horizontal"
                        initialValues={studentFromStore}
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
                        <Form.Item label="Mô tả" name="description"
                        >
                            <div>{studentFromStore.description}</div>
                        </Form.Item>



                    </Form>
                </div>
            </Modal>}
        </div>
    )
}

export default ListStudent
