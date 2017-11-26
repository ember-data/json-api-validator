import { DocumentError, DOCUMENT_ERROR_TYPES} from './errors/document-error';

function hasKey(document, key) {
  return Object.keys(document).indexOf(key) !== -1;
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

/**
 * @param jsonApiObject
 * @param errors
 * @param path
 * @returns {boolean}
 */
export default function validateObjectMeta(jsonApiObject, errors, path = '') {
  if (hasKey(jsonApiObject, 'meta')) {
    if (!isObject(jsonApiObject.meta)) {
      errors.push(new DocumentError(DOCUMENT_ERROR_TYPES.VALUE_MUST_BE_OBJECT, 'meta', jsonApiObject, path));
      return false;
    }
  }

  return true;
}
