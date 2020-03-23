import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useQuery } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";
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

const PrivateRoute = ({ component: Component, ...rest }) => {
  let location = useLocation();
  const {loading, error, data} = useQuery(LOGGEDIN_USER);
 
  const defaultRoute = "/login";

  if (loading) {
    return <Loading/>;
  }
  else {
    if (error) {
      return null;
    }
    return (
      // Show the component only when the user is logged in
      // Otherwise, redirect the user to /signin page
      <Route {...rest} render={props => (
        data && data.loggedInUser && data.loggedInUser.success ?
          <Component {...props} />
          : <Redirect to={{
                    pathname: defaultRoute,
                    state: { from: location }
                }} />
      )} />
    );
  }
};

export default PrivateRoute;

/*
type of page route
private route = only user who logged in can see
eg. products/inventory pages

public route (not restricted) = anyone can see
eg. main page/not sensitive info

public route (restricted) = only user who is not logged in can see
eg. login page

*/