import React from 'react';
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Route, Redirect, useLocation } from 'react-router-dom';

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

const PrivateRoute = ({ component: Component, ...rest }) => {
  let routeLocation = useLocation();
  const defaultRoute = "/login";

  const { data: { user: data } } = useQuery(LOGGEDIN_USER_STATE);

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest} render={props => (
      data && data.success ?
        <Component {...props} />
        : <Redirect to={{
                  pathname: defaultRoute,
                  state: { from: routeLocation }
              }} />
    )} />
  );
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