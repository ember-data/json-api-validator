import { ValidationError } from './errors/validation-error';
import { warn } from '@ember/debug';

export default function coalesceAndThrowErrors(issues) {
  let { errors, warnings } = issues;
  let error;
  let warning;

  if (errors.length === 0 && warnings.length === 0) {
    return;
  }

  if (errors.length === 1) {
    error = errors[0];
  } else {
    let errorMessage = 'The data provided failed json-api validation.' +
      ' The detected errors are listed below. Detailed stack traces for each error can' +
      ' be found in the errors array of this error object.\n\n\n';

    for (let i = 0; i < errors.length; i++) {
      errorMessage += '\n' + i + ')\t' + errors[i].message;
    }

    error = new ValidationError(errorMessage);
    error.errors = errors;
  }

  if (warnings.length === 1) {
    warning = warnings[0].message
  } else {
    warning = 'The data provided encountered likely json-api validation.' +
      ' The potential errors are listed below.\n\n\n';

    for (let i = 0; i < warnings.length; i++) {
      warning += '\n' + i + ')\t' + warnings[i].message;
    }
  }

  if (warnings.length) {
    warn(warning, false, {
      id: 'json-api-validater-warnings'
    });
  }

  if (errors.length) {
    throw error;
  }
}
