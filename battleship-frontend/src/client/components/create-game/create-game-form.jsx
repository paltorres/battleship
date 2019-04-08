/**
 * Create user form component.
 */
import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { Formik } from 'formik';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import FormContainer from '../form-container';
import { GET_MODS } from './queries';


class CreateUserForm extends Component {
  validate = values => {
    let errors = {};
    if (!values.title) {
      errors.title = 'Required';
    }
    if (!values.mod) {
      errors.mod = 'Required';
    }

    return errors;
  };

  handleSubmit = ({ title, mod }) => {
    this.props.createGame({ variables: { title, mod }});
  };

  render() {
    return (
      <FormContainer title="Create game">
        <Formik
          validate={this.validate}
          onSubmit={this.handleSubmit}
        >
          {({handleSubmit, handleChange }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle">
                <Form.Control
                  type="input"
                  name="title"
                  placeholder="Enter a title"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formMod">
                <Query query={GET_MODS}>
                  {({ loading, error, data }) => {
                    if (loading) {
                      return <div>loading mods</div>;
                    }
                    if (error) {
                      return <div>Error retrieving mods</div>;
                    }

                    return data.mods.map(({ id, name }) =>
                      <div className="d-flex flex-column" key={id}>
                        <ButtonGroup size="lg">
                          <Form.Check
                            type="radio"
                            id={id}
                            name="mod"
                            value={id}
                            label={name}
                            onChange={handleChange} />
                        </ButtonGroup>
                      </div>
                    );
                  }}
                </Query>
              </Form.Group>

              <Button variant="primary" type="submit">
                Create
              </Button>
            </Form>
          )}
        </Formik>
      </FormContainer>
    );
  }
}
export default CreateUserForm;
