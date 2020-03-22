import React from 'react';
import logo from './logo.svg';
import './css/App.css';
import './css/components.css';

import { Layout, Menu } from 'antd';

// import Component from './component/index.js';
import Header_01 from './component/header/header_01';
import Header_02 from './component/header/header_02';
import Layout_01 from './component/layout/layout_01';

const { Header, Content, Footer, Sider } = Layout;

let objects = require("./database/config/objects.json");
const App = () => {
    // console.log("Component",Component)
    // let Header = Component['Header_01'];
    const getObjects = () => {
      let result = [];
      let objectKeys = Object.keys(objects.objects);
      objectKeys.map((aKey, index)=>{
        result.push(
          <div key={index}>
            {aKey}<br/>
            {JSON.stringify(objects.objects[aKey])}
          </div>
        )
      })
      return result;
    }

    return (
      <Layout_01
        header={(<Header_02/>)}
        footer={"footer"}
      >
          <div id="layout-content">
            content
          </div>
          <div id="layout-footer">
            footer
          </div>

      </Layout_01>
    )
    // return (
    //   <Layout_01>
    //     <Layout className="layout-main">
    //       <Header_01/>
    //       <Layout>
    //         <Content>
    //           <div id="layout" style={{height:"100%"}}>
                
    //             <div>
    //               Section Header
    //             </div>
    //             <div>
    //               {getObjects()}
    //               {getObjects()}
    //               {getObjects()}
    //               {getObjects()}
    //               {getObjects()}
    //               {getObjects()}
    //               {getObjects()}
    //               {getObjects()}
    //             </div>
                
    //           </div>
    //         </Content>
    //         <Footer>Footer Here</Footer>
    //       </Layout>
    //     </Layout>

    //   </Layout_01>
    // )
}

export default App;
