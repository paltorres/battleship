/**
 * Application routes.
 */
import React, { Fragment } from 'react';

import routePaths from '../../constants/routes';
import RouteTransitions from '../route-transitions';
import ProtectedRoute from './protected-route';
import Home from '../home';
import Login from '../login';
import { BrowserRouter as Router } from 'react-router-dom';


const routes = ({ auth }) => (
  <Router>
    <Fragment>
      <ProtectedRoute
        exact
        shouldRedirect={auth}
        redirectTo={routePaths.root.path}
        path={routePaths.login.path}
        component={Login}
      />

      <ProtectedRoute
        exact
        shouldRedirect={!auth}
        redirectTo={routePaths.login.path}
        path={routePaths.root.path}
        component={Home}
      />
    </Fragment>
  </Router>
);

export default routes
