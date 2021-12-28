import React, { useEffect, useState } from 'react'
import { Layout} from 'antd';

import ListStudent from '../../pages/student/ListStudent';
import ListDepartment from '../../pages/department/ListDepartment';
import Profile from '../../pages/student/Profile';
import About from '../../pages/student/About';



const MainLayout = ({layoutSelectedIndex}) => {
 
    const { Content } = Layout
    const layoutList = [<About/> ,<Profile />,<ListStudent/>,<ListDepartment/>]
    
    return (
        <Layout style={{ padding: '0px 10px 10px' }}>
            <Content
              className="site-layout-background"
             
            >
              <div style={{minHeight: '600px',backgroundColor:'white'}} className="">
                  {layoutList[layoutSelectedIndex]}
              </div>
            </Content>
          </Layout>
    )
}

export default MainLayout
