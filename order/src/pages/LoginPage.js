import { Card, Col, Modal, Row } from "antd";
import React, { useEffect } from "react";

import { Form, Input, Button } from "antd";
import { useHistory } from "react-router";
import { login } from "../redux/action/actLogin";
import { useDispatch, useSelector } from "react-redux";
import { StopOutlined } from "@ant-design/icons";

const LoginPage = () => {
    const fullWidthStyle = { margin: "10px", height: "150px" };
    const history = useHistory();
    const dispatch = useDispatch();
    const authentication = useSelector((state) => state.authentication);
    

    useEffect(() => {
        const token = JSON.stringify(sessionStorage.getItem("accessToken"));
        if (token !== 'null') {
            history.push("/dashboard");
        }
    }, [history]);

    const loginHandle = (userLogin) => {
        dispatch(login(userLogin))
            .then((resp) => {
                
                history.push("/dashboard");
               
            })
            .catch(() => {
                Modal.error({
                    icon: <StopOutlined />,
                    title: <strong className="text-danger">Thông báo!</strong>,
                    content: `Đăng nhập không thành công!`,
                });
            });
    };

    const onFinish = (userLogin) => {
        loginHandle(userLogin);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div>
            {authentication.isLoggin === false &&
                <Row gutter={6}>
                    <Col className="gutter-row" span={24} style={fullWidthStyle}></Col>
                    <Col className="gutter-row" span={6}></Col>
                    <Col className="gutter-row" span={12}>
                       
                        <Card title={<div className="row">
                            <div className="col-2"> Đăng nhập</div>
                            <div className="col-4"></div>
                        </div>} bordered={true} hoverable={true} >
                            <Form
                                name="basic"
                                wrapperCol={{ span: 24 }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
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

                                <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ marginRight: `1rem` }}
                                    >
                                        ĐĂNG NHẬP
                                    </Button>

                                    <Button
                                        type="secondary"
                                        className="btn btn-primary"
                                        onClick={() => history.push("/register")}
                                    >
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col className="gutter-row" span={6}></Col>
                </Row>
               
                }
            
            
                
            
        </div>
    );
};

export default LoginPage;
