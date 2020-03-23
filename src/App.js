import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import logo from './logo.svg';

import './css/index.css';

import * as Component from './component/index.js';
import Login from './component/page/login';

import PrivateRoute from './utils/component/PrivateRoute';
import PublicRoute from './utils/component/PublicRoute';
import PageNotFound from './utils/component/PageNotFound';

let Component_Layout = Component['Layout_01'];
let Component_Header = Component['Header_01'];
// let Component_Footer = Component['Header_01'];

let objects = require("./database/config/objects.json");
const App = () => {
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

    const Haha = () => {
      return (
        <div>
          mainnnnnn
        </div>
      )
    }

    return (
      <Component_Layout
        header={(<Component_Header/>)}
        footer={"footer"}
      >
        <Switch>
            <PrivateRoute exact path={'/'} component={Haha} />
            <PublicRoute restricted={true} exact path={'/login'} component={Login} />
            <Route component={PageNotFound} />
        </Switch>
      </Component_Layout>
    )
}

export default App;
