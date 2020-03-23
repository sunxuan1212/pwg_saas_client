import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  MenuOutlined
} from '@ant-design/icons';

import CookieAPI from '../../utils/CookieAPI';

const Header_01 = (props) => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const handleMenuOpen = () => {
    setMenuCollapsed(true)
  }
  const handleMenuClose = () => {
    setMenuCollapsed(false)
  }

  let cookieAPI = CookieAPI();

  return (
    <header id="header_01">
      {/* <div onClick={menuCollapsed ? handleMenuClose : handleMenuOpen}>
          {React.createElement(menuCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
          <Menu selectable={false} inlineCollapsed={menuCollapsed}>
            <Menu.Item key="1">
              <MenuOutlined/>
            </Menu.Item>
          </Menu>
        </div> */}
      <Menu
        mode="inline"
        inlineCollapsed={menuCollapsed}
        style={{ height: "100%" }}
        selectable={false}
      >
        <Menu.Item key="0">
          <MenuOutlined onClick={menuCollapsed ? handleMenuClose : handleMenuOpen} />
        </Menu.Item>
        <Menu.Item key="1">
          <MenuOutlined />
          <span>Products</span>
        </Menu.Item>
        <Menu.Item key="2">
          <MenuOutlined />
          <span>Inventory</span>
        </Menu.Item>
        <Menu.Item key="3">
          <MenuOutlined />
          <span>Orders</span>
        </Menu.Item>
        <Menu.Item key="4">
          <MenuOutlined />
          <span>Website</span>
        </Menu.Item>
        <Menu.Item key="5" onClick={({ item, key, keyPath, domEvent })=>{
            cookieAPI.delete('access-saas');
            cookieAPI.delete('refresh-saas')
          }}>
          <MenuOutlined />
          <span>Logout</span>
        </Menu.Item>
      </Menu>
    </header>
  );
}

export default Header_01;