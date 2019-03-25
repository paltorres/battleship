/**
 * Protected route component.
 */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';


const ProtectedRoute = ({ shouldRedirect, redirectTo, component: Component, ...props }) => (
  <Route  {...props} render={props => (
    shouldRedirect && props.history.location.pathname !== redirectTo ? <Redirect to={redirectTo} /> : <Component {...props} />
  )} />
);

export default ProtectedRoute;
