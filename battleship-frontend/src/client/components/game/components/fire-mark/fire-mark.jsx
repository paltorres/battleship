/**
 * Fire mark.
 */
import React from 'react';

import './fire-mark.scss';


const FireMark = ({ miss }) => (
  <div className={`fire-mark fire-mark--${miss ? 'miss' : 'fire'}`} />
);

export default FireMark
