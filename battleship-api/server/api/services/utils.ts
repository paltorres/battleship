/**
 * Service utils.
 */
import prop from 'ramda/src/prop';
import objOf from 'ramda/src/objOf';


interface ErrorObj {
  errors: object,
}

interface ValidationError extends ErrorObj {}


export const makeErrorObj = (error): ErrorObj => {
  return objOf('errors')(error);
};

/**
 * Give a validation error, returns an object.
 * @param error
 */
export const makeValidationError = (error): ValidationError => {
  return makeErrorObj(prop('errors')(error));
};
