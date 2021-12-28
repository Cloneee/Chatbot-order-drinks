import { Card, Col, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

import { Form, Input, Button } from "antd";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CheckOutlined, StopOutlined } from "@ant-design/icons";
import { register } from "../redux/action/actLogin";
import { getDepartments } from "../redux/action/actDepartment";
import { Option } from "antd/lib/mentions";

const Register = () => {
    const fullWidthStyle = { margin: "10px", height: "150px" };
    const dispatch = useDispatch();

    let history = useHistory();
    const listDepartmentFromStore = useSelector((state) => state.departments);
    const listDepartment = listDepartmentFromStore
    const authentication = useSelector((state) => state.authentication);
    useEffect(() => {
        dispatch(getDepartments())

    }, [])
    const loginHandle = (user) => {
        register(user)
            .then(() => {
                Modal.info({
                    icon: <CheckOutlined />,
                    title: <strong className="text-danger">Thông báo</strong>,
                    content: `Đăng ký thành công!`,
                });
                history.push("/")
            })
            .catch((err) => {
                console.log(err)
                Modal.info({
                    icon: <StopOutlined />,
                    title: <strong className="text-danger">Có gì đó không ổn!</strong>,
                    content: `${err}`,
                });
            });
    };

    const onFinish = (user) => {
        loginHandle(user);
        console.log(user)
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <div>
            {authentication.isLoggin === false ? (
                <Row gutter={6}>
                    <Col className="gutter-row" span={24} style={fullWidthStyle}></Col>
                    <Col className="gutter-row" span={6}></Col>
                    <Col className="gutter-row" span={12}>
                        <Card title="Đăng ký" bordered={true} hoverable={true}>
                            <Form
                                name="basic"
                                wrapperCol={{ span: 24 }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Họ và tên:"
                                    name="name"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tên!" },
                                        {
                                            pattern: /[\D]/g,
                                            message: "Tên phải bắt đầu bằng chữ",
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Tài khoản:"
                                    name="username"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tài khoản!" },
                                        {
                                            pattern: /[\D]/g,
                                            message: "Tài khoản phải bắt đầu bằng chữ",
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Mật khẩu:"
                                    name="password"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập mật khẩu!" },
                                        {
                                            pattern: /[\w]/g,
                                            message: "Mật khẩu không hợp lệ!",
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    label="MSSV : "
                                    name="mssv"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập MSSV!" },

                                    ]}
                                    hasFeedback
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Lớp : "
                                    name="class"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập Lớp!" },

                                    ]}
                                    hasFeedback
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Khoa" name="department"  >
                            <Select name="department" style={{ width: '100%' }}  >
                                {


                                    listDepartment.map((department, id) => {
                                        return <Option key={id} value={department._id}>{department.name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>

                             

                                <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ marginRight: `1rem` }}
                                    >
                                        Đăng Ký
                                    </Button>
                                    <Button
                                        type="secondary"
                                        className="btn btn-primary"
                                        onClick={() => history.push("/")}
                                    >
                                        Quay lại
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={6}></Col>
                </Row>
            ) : (
                history.push("/dashbroad")
            )}
        </div>
    );
};

export default Register;
