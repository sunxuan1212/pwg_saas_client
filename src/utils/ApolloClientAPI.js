import { useApolloClient } from "@apollo/react-hooks";
import gql from 'graphql-tag';

export default function ApolloClientAPI() {
  const client = useApolloClient();

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
