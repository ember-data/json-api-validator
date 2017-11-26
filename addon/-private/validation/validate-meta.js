import { DocumentError, DOCUMENT_ERROR_TYPES} from './errors/document-error';

function hasKey(document, key) {
  return Object.keys(document).indexOf(key) !== -1;
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

/**
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
export default function validateObjectMeta(validator, document, errors, path = '') {
  if (hasKey(document, 'meta')) {
    if (!isObject(document.meta)) {
      errors.push(new DocumentError(DOCUMENT_ERROR_TYPES.VALUE_MUST_BE_OBJECT, 'meta', document, path));
      return false;
    }
  }

  return true;
}
