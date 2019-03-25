/**
 * Main container component.
 */
import React from 'react';


const styles= theme => ({
  content: {
    padding: `0 ${theme.spacing.unit * 4}px`,
  }
});

const MainContainer = ({ children }) => (
  <main>
    <div className="content">
      {children}
    </div>
  </main>
);

export default MainContainer;
