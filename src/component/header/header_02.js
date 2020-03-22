import React, { useState } from 'react';
import { Menu, Button, Layout } from 'antd';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  MenuOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Header_02 = (props) => {
  const [ menuCollapsed, setMenuCollapsed] = useState(false);
  const handleMenuOpen = () => {
    setMenuCollapsed(true)
  }
  const handleMenuClose = () => {
    setMenuCollapsed(false)
  }

  return (
    <header id="header_02">
      <div className="menu-item">
        <MenuOutlined/>
      </div>
      <div className="menu-title">
        <h3>Title</h3>
      </div>
      <div className="menu-item">

      </div>
    </header>
  );
}

export default Header_02;