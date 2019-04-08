/**
 * Form Container component.
 */
import React from 'react';
import propTypes from 'prop-types';

import './form-container.scss';


const FromContainer = ({ title, children }) => (
  <div className="form-container">
    <h1 className="h3 mb-3 font-weight-normal">{title}</h1>
    {children}
  </div>
);

FromContainer.propTypes = {
  title: propTypes.string.isRequired,
  children: propTypes.node.isRequired,
};

export default FromContainer;
