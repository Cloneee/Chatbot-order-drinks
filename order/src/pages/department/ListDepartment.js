import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'; import {
    Table, Tag, Button
} from 'antd';
import { getDepartments } from '../../redux/action/actDepartment';
const ListDepartment = () => {
    const dispatch = useDispatch();

    const listDepartmentFromStore = useSelector((state) => state.departments);
    const listDepartment = listDepartmentFromStore
    const [isNeedRerender, setisNeedRerender] = useState(false)
    useEffect(() => {
        dispatch(getDepartments())
      
    }, [isNeedRerender, dispatch])

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Tên Khoa',
            dataIndex: 'name',
            key: 'name',
            render: text => <strong>{text}</strong>,
        },
        



    ]
    return (
        <div>
        <Table style={{ marginTop: '15px' }} rowKey="id" columns={columns} dataSource={listDepartment} pagination={false} scroll={{ y: 850 }} />

        </div>
    )
}

export default ListDepartment
