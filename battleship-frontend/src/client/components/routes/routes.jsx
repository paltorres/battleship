/**
 * Application routes.
 */
import React, { Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import routePaths from '../../constants/routes';
import ProtectedRoute from './protected-route';
import Home from '../home';
import Login from '../login';
import SignIn from '../sign-in';
import CreateGame from '../create-game';
import Game from '../game';
import Navbar from '../navbar';


const routes = ({ auth }) => (
  <Router>
    <Fragment>
      <Navbar />

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

      <ProtectedRoute
        exact
        shouldRedirect={false}
        path={routePaths.signIn.path}
        component={SignIn}
      />

      <ProtectedRoute
        exact
        shouldRedirect={!auth}
        redirectTo={routePaths.login.path}
        path={routePaths.createGame.path}
        component={CreateGame}
      />

      <ProtectedRoute
        exact
        shouldRedirect={!auth}
        redirectTo={routePaths.login.path}
        path={routePaths.game.path}
        component={Game}
      />
    </Fragment>
  </Router>
);

export default routes
