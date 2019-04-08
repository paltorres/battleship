/**
 * Main container component.
 */
import React from 'react';

import './main-container.scss';


const MainContainer = ({ children }) => (
  <main role="mail" className="flex-shrink-0">
    <div className="container">
      {children}
    </div>
  </main>
);

export default MainContainer;
