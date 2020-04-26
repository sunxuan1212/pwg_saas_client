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

let objects = require("./database/config/objects.json");

const GET_USER_STATE = gql`
  {
    user @client {
      success
      message
      data {
        _id
        username
        config_id
      } 
    }
  }
`;

const App = (props) => {
  const { data: { user: loggedUser} } = useQuery(GET_USER_STATE);

  const getObjects = () => {
    let result = [];
    let objectKeys = Object.keys(objects.objects);
    objectKeys.map((aKey, index) => {
      result.push(
        <div key={index}>
          {aKey}<br />
          {JSON.stringify(objects.objects[aKey])}
        </div>
      )
    })
    return result;
  }

  const Haha = () => {
    return (
      <div>
        mainnnnnn
        </div>
    )
  }

  return (
    <Component_Layout
      header={loggedUser && loggedUser.success ? (<Component_Header />) : null}
      footer={loggedUser && loggedUser.success ? "2020" : null}
    >
      <Switch>
        <PrivateRoute exact path={'/'} component={Haha}/>
        <PrivateRoute exact path={'/products'} component={Products}/>
        <PrivateRoute exact path={'/inventory'} component={Inventory}/>
        <PrivateRoute exact path={'/orders'} component={Orders}/>
        <PrivateRoute exact path={'/website'} component={Haha}/>
        <PublicRoute restricted={true} exact path={'/login'} component={Login} />
        <Route component={PageNotFound} />
      </Switch>
    </Component_Layout>
  )
}

export default App;
