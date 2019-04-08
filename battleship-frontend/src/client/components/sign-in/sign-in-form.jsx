/**
 * Create user form component.
 */
import React, { Component } from 'react';

import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';

import FormContainer from '../form-container';


class SignInForm extends Component {
  validate = values => {
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
    this.props.createUser({ variables: { username, password }});
  };

  render() {
    return (
      <FormContainer title="Create user">
        <Formik
          validate={this.validate}
          onSubmit={this.handleSubmit}
        >
          {({
              handleSubmit,
              handleChange,
              /*
              handleBlur,
              values,
              touched,
              isValid,
              errors,
              */
            }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername">
                <Form.Control
                  type="input"
                  name="username"
                  placeholder="Enter username"
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

              <Button variant="primary" type="submit">
                Create
              </Button>

              <LinkContainer to="/login">
                <Button variant="link">
                  Login
                </Button>
              </LinkContainer>
            </Form>
          )}
        </Formik>
      </FormContainer>
    );
  }
}
export default SignInForm;
