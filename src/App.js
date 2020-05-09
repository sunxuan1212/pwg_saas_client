import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import logo from './logo.svg';

import './css/index.css';

import * as Component from './component/index.js';
import Login from './component/page/Login';
import Products from './component/page/Products';
import Inventory from './component/page/Inventory';
import Orders from './component/page/Orders';
import Page_01 from './component/page/component/Page_01';

import PrivateRoute from './utils/component/PrivateRoute';
import PublicRoute from './utils/component/PublicRoute';
import PageNotFound from './utils/component/PageNotFound';


let Component_Layout = Component['Layout_01'];
let Component_Header = Component['Header_01'];
// let Component_Footer = Component['Header_01'];

const GET_USER_STATE = gql`
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

// const GET_CONFIG_STATE = gql`
//   {
//     config @client {
//       success
//       message
//       data {
//         _id
//         username
//         configId
//       } 
//     }
//   }
// `;

const App = (props) => {
  const getUserResult = useQuery(GET_USER_STATE);
  console.log('getUserResult',getUserResult)
  const loggedIn = getUserResult && getUserResult.data && getUserResult.data.user && getUserResult.data.user.success ? true : false;

  const Main = () => {
    return (
      <div>
        Main
      </div>
    )
  }

  return (
    <Component_Layout
      header={loggedIn ? (<Component_Header />) : null}
      footer={loggedIn ? "2020" : null}
    >
      <Switch>
        {/* <PrivateRoute exact path={'/products'} component={Products}/> */}
        <PrivateRoute exact path={'/'} component={Inventory}/>
        <PrivateRoute exact path={'/main'} component={Main}/>
        <PrivateRoute exact path={'/orders'} component={Orders}/>
        <PrivateRoute exact path={'/configuration'} component={Main}/>
        <PublicRoute restricted={true} exact path={'/login'} component={Login} />
        <Route component={PageNotFound} />
      </Switch>
    </Component_Layout>
  )
}

export default App;
