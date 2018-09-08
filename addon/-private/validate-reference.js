import { REFERENCE_ERROR_TYPES, ReferenceError } from './errors/reference-error';
import { dasherize } from 'json-api-validations/-private/utils/dasherize';

const ALL_REFERENCE_KEYS = ['type', 'id', 'meta'];

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

/**
 *
 * @param reference
 * @param errors
 * @param path
 * @returns {boolean}
 */
export default function validateReference(reference, errors, path = '') {
  if (!isObject(reference)) {
    errors.push(new ReferenceError(REFERENCE_ERROR_TYPES.INVALID_REFERENCE, undefined, undefined, reference, path));
    return false;
  }

  let hasError = false;
  let keys = Object.keys(reference);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    if (ALL_REFERENCE_KEYS.indexOf(key) === -1) {
      hasError = true;
      errors.push(new ReferenceError(REFERENCE_ERROR_TYPES.UNEXPECTED_KEY, reference.type, key, reference, path));
    }
  }

  if (typeof reference.id !== 'string' || reference.id.length === 0) {
    errors.push(new ReferenceError(REFERENCE_ERROR_TYPES.INVALID_ID_VALUE, undefined, 'id', reference.id, path));
  }
  if (typeof reference.type !== 'string' || reference.type.length === 0) {
    errors.push(new ReferenceError(REFERENCE_ERROR_TYPES.INVALID_TYPE_VALUE, undefined, 'type', reference.type, path));
  } else {
    let dasherized = dasherize(reference.type);

    if (dasherized !== reference.type) {
      errors.push(new ReferenceError(REFERENCE_ERROR_TYPES.INVALID_TYPE_FORMAT, dasherized, 'type', reference.type, path));
    }

    let schema = this.schemaFor(dasherized);

    if (schema === undefined) {
      errors.push(new ReferenceError(REFERENCE_ERROR_TYPES.UNKNOWN_SCHEMA, reference.type, 'type', reference.type, path));
      hasError = true;
    }
  }

  hasError = !this.validateMeta(reference, errors, path) || hasError;

  return !hasError;
}
