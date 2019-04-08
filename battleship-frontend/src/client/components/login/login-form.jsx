/**
 * Login form
 */
import React, { Component } from 'react';

import { Formik } from 'formik';
import { LinkContainer } from 'react-router-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import FormContainer from '../form-container';


class LoginForm extends Component {
  validateForm = values => {
    let errors = {};
    if (!values.username) {
      errors.username = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  };

  handleSubmit = ({ username, password }) => {
    this.props.login({ variables: { username, password }});
  };

  render() {
    return (
      <FormContainer title="Login">
        <Formik
          validate={this.validateForm}
          onSubmit={this.handleSubmit}
        >
          {({
              handleSubmit,
              handleChange,
            }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formusername">
                <Form.Control
                  type="input"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" block>
                Submit
              </Button>

              <LinkContainer to="/sign-in">
                <Button variant="link" block>
                  Create a user
                </Button>
              </LinkContainer>
            </Form>
          )}
        </Formik>
      </FormContainer>
    );
  }
}

export default LoginForm;
