import React from 'react';
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Route, Redirect } from 'react-router-dom';

const LOGGEDIN_USER_STATE = gql`
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
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const defaultRoute = "/";

  const { data: {user: data} } = useQuery(LOGGEDIN_USER_STATE);

  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route {...rest} render={props => (
      data && data.success && restricted ?
        <Redirect to={defaultRoute} />
        : <Component {...props} />
    )} />
  );
};

export default PublicRoute;