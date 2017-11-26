import { ValidationError } from './errors/validation-error';

export default function coalesceAndThrowErrors(errors) {
  if (errors.length === 0) {
    return;
  }

  if (errors.length === 1) {
    throw errors[0];
  }

  let errorMessage = 'The data provided failed json-api validation.' +
    ' The detected errors are listed below. Detailed stack traces for each error can' +
    ' be found in the errors array of this error object.\n\n\n';

  for (let i = 0; i < errors.length; i++) {
    errorMessage += '\n' + i + ')\t' + errors[i].message;
  }

  let error = new ValidationError(errorMessage);
  error.errors = errors;

  throw error;
}
