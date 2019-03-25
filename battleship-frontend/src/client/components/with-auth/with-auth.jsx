/**
 * WithAuth component.
 */
import React, { useState, useEffect } from 'react';
import { withApollo } from 'react-apollo';

import { SET_AUTH } from '../login/queries';


const WithAuth = (props) => {
  const { client, component } = props;
  const hasToken = localStorage.getItem('x-token');
  const [auth, setAuth] = useState(Boolean(hasToken));

  useEffect(() => client.cache.watch({
      query: SET_AUTH,
      optimistic: true,
      callback: ({ complete, result }) => {
        if (!complete) return;

        const { auth: { isAuth }} = result;
        if (auth !== isAuth) {
          setAuth(isAuth);
        }
      }
    })
  );

  return React.createElement(component, { auth });
};

export default withApollo(WithAuth);
