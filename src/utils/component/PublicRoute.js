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
        configId
      } 
    }
  }
`;
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const defaultRoute = "/";

  const {data: userResult, error} = useQuery(LOGGEDIN_USER_STATE);
  let loggedIn = false;
  if (!error) {
    loggedIn = !error && userResult && userResult.user && userResult.user.success ? true : false;
  }
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route {...rest} render={props => (
      loggedIn && restricted ?
        <Redirect to={defaultRoute} />
        : <Component {...props} />
    )} />
  );
};

export default PublicRoute;