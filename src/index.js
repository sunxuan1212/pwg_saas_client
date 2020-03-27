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
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache({ addTypename: false });
const client = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: MIDDLETIER_URL,
        credentials: "include"
    })
});

const jsx = (
  <BrowserRouter>
      <ApolloProvider client={client}>
          <App/>
      </ApolloProvider>
  </BrowserRouter>
);

const run = () => {
  client.query({
    query: gql`
      query loggedInUser{
        loggedInUser{
            success
            message
            data
        }
      }
    `
  }).then(({data: result})=>{
    let userFound = null;
    if (result && result.loggedInUser) {
      userFound = result.loggedInUser;
    }
    console.log("userFound",userFound)
    cache.writeData({
      data: {
        user: userFound
      }
    });
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
