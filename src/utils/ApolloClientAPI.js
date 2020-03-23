import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {MIDDLETIER_URL} from './Constants';

export default function ApolloClientAPI() {
  const cache = new InMemoryCache({ addTypename: false });
  const client = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: MIDDLETIER_URL,
        credentials: "include"
    })
  });

  return {
    query: (query, params={}, callback = null)=>{
      let result = {
        query: gql`${query}`,
        variables: params
      }
      // if (callback != null) {
      //   result['onCompleted'] = callback;
      // }
      return client.query(result)
    },
    mutation: (query, params={}, callback = null)=>{
      let result = {
        mutation: gql`${query}`,
        variables: params
      }
      // if (callback != null) {
      //   result['onCompleted'] = callback;
      // }
      return client.mutate(result)
    }
  }
}
