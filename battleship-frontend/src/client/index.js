/**
 * Application starter.
 */
import './styles/theme/global.scss';

import './initializer';

import React from 'react';
import { render } from 'react-dom';

import App from './components/app';

export const applicationContainer = document.getElementById('app');

render(<App />, applicationContainer);
