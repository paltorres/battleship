/**
 * Ship component.
 */
import React from 'react';

import './ship.scss';


const sizeUnit = 'rem';

const baseStyles = () => ({
  width: 2,
  height: 2,
  paddingRight: '3px',
  paddingBottom: '0px',
  left: '0px',
  top: '0px',
  margin: '0px'
});

const Ship = ({ length, direction, sunken }) => {
  const styles = baseStyles();
  if (direction === 'horizontal') {
    styles.width = `${styles.width * length}${sizeUnit}`;
    styles.height = `${styles.height}${sizeUnit}`;
  } else {
    styles.height = `${styles.height * length}${sizeUnit}`;
    styles.width = `${styles.width}${sizeUnit}`;
  }

  return <div className={`ship ${sunken ? 'ship--sunken' : ''}`} style={styles} />;
};


export default Ship;
