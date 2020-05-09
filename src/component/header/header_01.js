import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  useHistory
} from "react-router-dom";
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { Menu, Divider, Button, Tooltip } from 'antd';
import {
  ArrowLeftOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import confirmation from '../../utils/component/confirmation';
import { getConfig } from '../../utils/Constants';

const LOGOUT_MUTATION = gql`
    mutation logout {
      logout {
        success
        message
        data
      }
    }
`;

const LOGGEDIN_USER_STATE = gql`
  {
    user @client {
      success
      message
      data {
        _id
        username
        configId
      } 
    }
  }
`;

const Header_01 = (props) => {
  const apolloClient = useApolloClient();
  let routeHistory = useHistory();
  const [config , setConfig] = useState(null);
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: (result) => {
      if (result && result.logout && result.logout.success) {
        console.log("logged out")
        let redirectPath = '/login';
        // if (routeHistory.location.state && routeHistory.location.state.from) {
        //   redirectPath = routeHistory.location.state.from.pathname
        // }

        // apolloClient.resetStore()
        apolloClient.writeData({
          data: {
            user: null,
            config: null
          }
        })
        routeHistory.push(redirectPath)
      }
    }
  });
  // const userResult = useQuery(LOGGEDIN_USER_STATE);

  useEffect(() => {
    const runAsyncFunc = async () => {
      setConfig(await getConfig())
    }
    runAsyncFunc()
  }, [])

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const handleMenuOpen = () => {
    setMenuCollapsed(true)
  }
  const handleMenuClose = () => {
    setMenuCollapsed(false)
  }

  const handleLogout = () => {
    confirmation('confirm', 'Confirm Logout?', ()=>{
      logout();
    })
  }

  const menuItem = [
    // {
    //   name: 'Products',
    //   icon: null,
    //   route: '/products'
    // },
    {
      name: 'Inventory',
      icon: null,
      route: '/'
    },
    {
      name: 'Orders',
      icon: null,
      route: '/orders'
    },
    // {
    //   name: 'Configuration',
    //   icon: null,
    //   route: '/configuration'
    // }
  ]

  const getMenuItemDisplay = () => {
    let result = [];
    menuItem.map((aMenuItem,index)=>{
      let buttonProps = {
        shape: 'circle'
      }
      if (menuCollapsed) {
        buttonProps['shape'] = 'circle';
      }
      else {
        buttonProps['type'] = 'link'
      }
      result.push(
        <div className={`header_01-item ${routeHistory.location.pathname == aMenuItem.route ? "header_01-activeLink" : ""}`} key={index} onClick={()=>{
          routeHistory.push(aMenuItem.route)
          }}>
          {
            menuCollapsed ? 
            <Tooltip title={aMenuItem.name} placement="right">
              <Button {...buttonProps}>{aMenuItem.name[0].toUpperCase()}</Button>
            </Tooltip>
            : <span className={routeHistory.location.pathname == aMenuItem.route ? "header_01-activeLink" : ""}>{aMenuItem.name}</span>
          }
        </div>
      )
    });
    return result;
  }

  return (
    <header id="header_01" data-header-collapsed={menuCollapsed}>
      <div className="header_01-header">
        <div className="header_01-item collapse-btn">
           <Button 
              shape="circle" 
              type="link"
              shape="circle"
              icon={<ArrowLeftOutlined rotate={menuCollapsed ? 180 : 0} />} 
              onClick={menuCollapsed ? handleMenuClose : handleMenuOpen}
            />
          {/* <ArrowLeftOutlined rotate={menuCollapsed ? 180 : 0} onClick={menuCollapsed ? handleMenuClose : handleMenuOpen} /> */}
        </div>
      </div>

      <div className="header_01-content">
        {getMenuItemDisplay()}
      </div>
      <div className="header_01-footer">
        {
          config && !menuCollapsed? (
            <div className="header_01-item" style={{cursor: 'default'}}>
              { config.configId }
            </div>
          ) : null
        }
        <div className="header_01-item" onClick={handleLogout}>
          {
            menuCollapsed ?
                <Tooltip title="Logout" placement="right">
                  <Button 
                    shape="circle" 
                    icon={<LogoutOutlined />} 
                  />
                </Tooltip>
              : 
              <span>Logout</span>
          }
        </div>
      </div>
    </header>
  );
}

export default Header_01;