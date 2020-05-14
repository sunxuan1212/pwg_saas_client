import React, {useState, useEffect} from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
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
import Loading from './utils/component/Loading';
import { setUserCache, setConfigCache, useUserCache, useConfigCache } from './utils/Constants';


let Component_Layout = Component['Layout_01'];
let Component_Header = Component['Header_01'];
// let Component_Footer = Component['Header_01'];

const GET_LOGGED_IN_USER = gql`
  query loggedInUser{
    loggedInUser{
        success
        message
        data
    }
  }
`

const GET_USER_CONFIG = gql`
  query userConfig($configId: String!) {
    userConfig(configId: $configId) {
        success
        message
        data
    }
  }
`

const App = (props) => {
  const [ loggedIn, setLoggedIn ] = useState(false);
  const { data, error, loading, refetch } = useQuery(GET_LOGGED_IN_USER,{
    fetchPolicy: 'cache-and-network',
    onCompleted: (result) => {
      if (result && result.loggedInUser && result.loggedInUser.success) {
        // setUserCache(result.loggedInUser);
        fetchConfig({
          variables: {
            configId: result.loggedInUser.data.configId
          }
        })
      }
    },
    onError: (err) => {
      console.log(err)
      setLoggedIn(false)
    }
  });

  const [ fetchConfig, { data: configData, error: configError, loading: configLoading }] = useLazyQuery(GET_USER_CONFIG,{
    fetchPolicy: 'cache-and-network',
    onCompleted: (result) => {
      if (result && result.userConfig && result.userConfig.success) {
        setConfigCache(result.userConfig.data)
        setUserCache(data.loggedInUser);
        setLoggedIn(true)

      }
    }
  });

  const userCache = useUserCache();
  const configCache = useConfigCache();

  useEffect(()=>{
    if (userCache && userCache.success && configCache) {
      setLoggedIn(true)
    }
    else {
      setLoggedIn(false)
    }
  },[userCache,configCache]);

  const Main = () => {
    return (
      <div>
        Main
      </div>
    )
  }

  if (loading || configLoading) return <Loading/>;
  if (error) console.log(`error: ${error}`);

  return (
    <Component_Layout
      header={loggedIn ? (<Component_Header setLoggedIn={setLoggedIn}/>) : null}
      footer={loggedIn ? "2020" : null}
    >
      <Switch>
        <PublicRoute restricted={true} exact path={'/login'} component={Login} />
        {/* <PrivateRoute exact path={'/products'} component={Products}/> */}
        <PrivateRoute exact path={'/'} component={Inventory}/>
        <PrivateRoute exact path={'/main'} component={Main}/>
        <PrivateRoute exact path={'/orders'} component={Orders}/>
        <PrivateRoute exact path={'/configuration'} component={Main}/>
        <Route component={PageNotFound} />
      </Switch>
    </Component_Layout>
  )
}

export default App;
