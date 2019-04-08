import React, { Fragment } from 'react'
import history from '../../lib/history';
import client from '../../lib/client';

import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';

import Head from '../head'
import Navbar from '../navbar'
import Routes from '../routes'
import MainContainer from '../main-container'
import WithAuth from '../with-auth';


const App = () => (
  <Fragment>
    <Head />

    <ApolloProvider client={client}>

      <MainContainer>
        <WithAuth component={Routes} />
      </MainContainer>
    </ApolloProvider>
  </Fragment>
);

export default App
