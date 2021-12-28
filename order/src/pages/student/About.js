
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'; import {
    Table, Tag, Button
} from 'antd';
import { getDepartments } from '../../redux/action/actDepartment';
const About = () => {
    const dispatch = useDispatch();

    const listDepartmentFromStore = useSelector((state) => state.departments);
    const listDepartment = listDepartmentFromStore
    const [isNeedRerender, setisNeedRerender] = useState(false)
    useEffect(() => {
        dispatch(getDepartments())

    }, [isNeedRerender, dispatch])
    return (
        <div className='row' >
            <div className='text-center' style={{ marginTop: "50px" }}>
                <strong style={{ fontSize: "130%" }}>Thông tin dự án</strong>
                <p>Demo quản lý đơn hàng của Chatbot</p>
            </div>

        </div>
    )
}

export default About
