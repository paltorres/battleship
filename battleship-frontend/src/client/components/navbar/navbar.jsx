/**
 * Battleship Navbar.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Navbar from 'react-bootstrap/NavBar';


// podria darse cuenta si esta logueado o no y hacer algo al respecto )?=
const NavbarCmp = () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">
      <img
        alt=""
        src="https://image.flaticon.com/icons/svg/72/72277.svg"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />
      <span className="navbar-brand-name">
        {'Battleship Stx'}
      </span>
    </Navbar.Brand>
  </Navbar>
);

NavbarCmp.propTypes = {
  //classes: PropTypes.object.isRequired,
};

export default NavbarCmp;
