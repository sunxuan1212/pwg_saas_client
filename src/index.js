import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import gql from "graphql-tag";

// import './css/base.css';
import App from './App';
import ApolloClientAPI from './utils/ApolloClientAPI';

import * as serviceWorker from './serviceWorker';

const theClientAPI = ApolloClientAPI();
export default theClientAPI;
const { client, cache, ...restClient } = theClientAPI;

const run = () => {

  ReactDOM.render((
    <BrowserRouter>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>
    </BrowserRouter>
  ),document.getElementById('root'));
  
}

const init = () => {
  run();
}

init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
