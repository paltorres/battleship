/**
 *
 */
import React from 'react';
import { AnimatedSwitch } from 'react-router-transition';

import './route-transitions.scss';

const RouteTransitions = ({ children }) => (
  <AnimatedSwitch
    atEnter={{ opacity: 0 }}
    atLeave={{ opacity: 0 }}
    atActive={{ opacity: 1 }}
    className='route-wrapper'
  >
    {children}
  </AnimatedSwitch>
);

export default RouteTransitions;
