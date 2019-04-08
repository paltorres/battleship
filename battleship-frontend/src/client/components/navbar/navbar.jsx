/**
 * Battleship Navbar.
 */
import './navbar.scss';

import React from 'react';
import { withRouter } from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/NavBar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';


const NavbarCmp = ({ history }) => (
  <header>
    <Navbar bg="dark" variant="dark" fixed="top">
      <LinkContainer to="/">
        <Navbar.Brand>
          <img
            alt=""
            src="https://image.flaticon.com/icons/svg/72/72277.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          <span className="navbar-brand-name">
            {'Battleship'}
          </span>
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle />

      <Button variant="outline-info" onClick={() => history.push('/create-game')}>Create Game</Button>

    </Navbar>
  </header>
);

NavbarCmp.propTypes = {
  //classes: PropTypes.object.isRequired,
};

export default withRouter(NavbarCmp);
