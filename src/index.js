import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { BrowserRouter } from 'react-router-dom';

// import './css/base.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache({ addTypename: false });
const client = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: "http://localhost:5003/graphql",
        credentials: "include"
    })
    //fetch: customFetch,
    // request: (operation) => {
    //     const accessToken = Cookies.get('accessToken');
    //     if (accessToken) {
    //         let accessTokenObj = JSON.parse(accessToken);
            
    //         operation.setContext({
    //             headers: {
    //                 [accessTokenHeaderLabel]: accessTokenObj.accessToken ? accessTokenObj.accessToken : null,
    //                 [refreshTokenHeaderLabel]: accessTokenObj.refreshToken ? accessTokenObj.refreshToken : null
    //             }
    //         });
    //     }
    // },
});

const jsx = (
  <BrowserRouter>
      <ApolloProvider client={client}>
          <App/>
      </ApolloProvider>
  </BrowserRouter>
);

const run = () => {
  ReactDOM.render(jsx,document.getElementById('root'));
}

const init = () => {
  run();
}

init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
