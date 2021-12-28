
import React, { useState } from 'react'
import { Layout } from 'antd';
import LeftSlider from '../component/layout/LeftSlider';
import MainLayout from '../component/layout/MainLayout';
// import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router';
const Dashbroad = () => {
  // const history = useHistory()
  // const authentication = useSelector((state) => state.authentication);
  const [layoutSelectedIndex, setlayoutSelectedIndex] = useState(0)
  const onSelectedLayoutIndexChange = (index) =>{
    setlayoutSelectedIndex(index)
  }
  return (
    <div >
        {/* {authentication.isLoggin === true  ? */}
      <Layout style={{ paddingTop: '10px' }} >
    
        <Layout>
          <LeftSlider onSelectedLayoutIndexChange={onSelectedLayoutIndexChange} />
          <MainLayout layoutSelectedIndex={layoutSelectedIndex} />
        </Layout>
      </Layout> 
      {/* : history.push("/") } */}
    </div>
  )
}

export default Dashbroad
