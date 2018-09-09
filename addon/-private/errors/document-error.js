import {
  NICE_ERROR_TYPES,
  ValidationError,
  createNiceErrorMessage,
  uniqueErrorId,
} from './validation-error';
import isPlainObject from '../utils/is-plain-object';
import aboutAnOxfordComma from '../utils/about-an-oxford-comma';
import typeOf from '../utils/type-of';

export const DOCUMENT_ERROR_TYPES = {
  INVALID_DOCUMENT: uniqueErrorId(),
  MISSING_MANDATORY_MEMBER: uniqueErrorId(),
  NULL_MANDATORY_MEMBER: uniqueErrorId(),
  DISALLOWED_DATA_MEMBER: uniqueErrorId(),
  DISALLOWED_INCLUDED_MEMBER: uniqueErrorId(),
  UNKNOWN_MEMBER: uniqueErrorId(),
  VALUE_MUST_BE_OBJECT: uniqueErrorId(),
  VERSION_MUST_BE_STRING: uniqueErrorId(),
  MISSING_VERSION: uniqueErrorId(),
  INVALID_INCLUDED_VALUE: uniqueErrorId(),
};

export class DocumentError extends ValidationError {
  constructor(options) {
    let { value, path, document } = options;
    const errorLocation = createNiceErrorMessage({
      key: Array.isArray(value) ? '' : value,
      value: isPlainObject(document) ? JSON.stringify(document) : document,
      path,
      code: NICE_ERROR_TYPES.OBJECT_ERROR,
    });
    const error = buildDocumentErrorMessage(options);
    const message = error + errorLocation;
    super(message);
  }
}

function buildDocumentErrorMessage(options) {
  let { value, code, document, member, path } = options;

  switch (code) {
    case DOCUMENT_ERROR_TYPES.INVALID_DOCUMENT:
      return `Value of type "${typeOf(
        document
      )}" is not a valid json-api document.`;

    case DOCUMENT_ERROR_TYPES.MISSING_MANDATORY_MEMBER:
      return `A json-api document MUST contain one of ${aboutAnOxfordComma(
        value
      )} as a member.`;

    case DOCUMENT_ERROR_TYPES.NULL_MANDATORY_MEMBER:
      return `A json-api document MUST contain one of ${aboutAnOxfordComma(
        value
      )} as a non-null member.`;

    case DOCUMENT_ERROR_TYPES.DISALLOWED_DATA_MEMBER:
      return 'A json-api document MUST NOT contain both `data` and `errors` as a members.';

    case DOCUMENT_ERROR_TYPES.DISALLOWED_INCLUDED_MEMBER:
      return 'A json-api document MUST NOT contain `included` as a member unless `data` is also present.';

    case DOCUMENT_ERROR_TYPES.UNKNOWN_MEMBER:
      if (member === 'jsonapi') {
        return `'${value}' is not a valid member of the jsonapi object on a json-api document.`;
      }
      return `'${value}' is not a valid member of a json-api document.`;

    case DOCUMENT_ERROR_TYPES.MISSING_VERSION:
      return `expected a 'version' member to be present in the 'document.jsonapi' object`;

    case DOCUMENT_ERROR_TYPES.VERSION_MUST_BE_STRING:
      return `expected the 'version' member present in the 'document.jsonapi' object to be a string, found value of type ${typeOf(
        value
      )}`;

    case DOCUMENT_ERROR_TYPES.VALUE_MUST_BE_OBJECT:
      return `'${path}.${member}' MUST be an object if present, found value of type ${typeOf(
        value
      )}`;

    case DOCUMENT_ERROR_TYPES.INVALID_INCLUDED_VALUE:
      return `expected document.included to be an Array, instead found value of type ${typeOf(
        value
      )}`;
  }

  return 'DocumentError';
}
