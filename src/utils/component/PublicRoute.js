import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Loading from './Loading';

const LOGGEDIN_USER = gql`
  query loggedInUser{
    loggedInUser{
        success
        message
        data
    }
  }
`;

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const {loading, error, data} = useQuery(LOGGEDIN_USER);
 
  const defaultRoute = "/";

  if (loading) {
    return <Loading/>;
  }
  else {
    if (error) {
      return null;
    }
    return (
      // restricted = false meaning public route
      // restricted = true meaning restricted route
      <Route {...rest} render={props => (
        data && data.loggedInUser && data.loggedInUser.success && restricted ?
          <Redirect to={defaultRoute} />
          : <Component {...props} />
      )} />
    );
  }

};

export default PublicRoute;