import { Space, Spin } from 'antd'
import React from 'react'

const Loading = ({location}) => {
    return (

        <Space size="middle" >
            <Spin size="small" />
            <Spin />
            <Spin size="large" />
              {location}  
        </Space>
    )
}

export default Loading
