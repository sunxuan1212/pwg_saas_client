import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { BrowserRouter } from 'react-router-dom';
import gql from "graphql-tag";

// import './css/base.css';
import App from './App';
import {MIDDLETIER_URL} from './utils/Constants';
import ApolloClientAPI from './utils/ApolloClientAPI';

import * as serviceWorker from './serviceWorker';

const theClientAPI = ApolloClientAPI();
export default theClientAPI;
const { client, cache, ...restClient } = theClientAPI;

const jsx = (
  <BrowserRouter>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>
  </BrowserRouter>
);

const GET_LOGGEDIN_USER = gql`
  query loggedInUser{
    loggedInUser{
        success
        message
        data
    }
  }
`
const GET_USERCONFIG = gql`
  query userConfig($configId: String!) {
    userConfig(configId: $configId) {
        success
        message
        data
    }
  }
`
const run = () => {
  let cacheData = {
    data: {
      user: null,
      config: null
    }
  }
  restClient.query(GET_LOGGEDIN_USER).then(({data: result})=>{
    let userFound = null;
    if (result && result.loggedInUser) {
      userFound = result.loggedInUser;
    }
    cacheData = {
      data: {
        user: userFound,
        config: null
      }
    }
    
    restClient.query(
      GET_USERCONFIG,
      {
        configId: userFound.data.configId
      }
    ).then(({data: result2})=>{
      if (result2.userConfig.success) {
        cacheData = {
          data: {
            user: userFound,
            config: result2.userConfig.data
          }
        }
      }
      cache.writeData(cacheData);
      ReactDOM.render(jsx,document.getElementById('root'));
    }).catch(err=>{
      cache.writeData(cacheData);
      ReactDOM.render(jsx,document.getElementById('root'));
      console.log('GET_USERCONFIG error', err)
    })

  }).catch(err=>{
    console.log('get logged user error', err)
    cache.writeData(cacheData)
    ReactDOM.render(jsx,document.getElementById('root'));
  })
}

const init = () => {
  run();
}

init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
