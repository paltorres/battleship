import React, { Component } from 'react';

import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class LoginForm extends Component {
  handleSubmit = ({ username, password }) => {
    this.props.login({ variables: { username, password }});
  };

  render() {
    return (
      <Formik
        initialValues={{
          username: 'teest',
          password: 'test',
        }}
        validate={values => {
          let errors = {};
          if (!values.username) {
            errors.username = 'Required';
          }
          if (!values.password) {
            errors.password = 'Required';
          }
          return errors;
        }}
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
            <Form.Group controlId="formusername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="input"
                name="username"
                placeholder="Enter username"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}

export default LoginForm;
