import {
  NICE_ERROR_TYPES,
  ValidationError,
  createNiceErrorMessage,
  uniqueErrorId,
} from './validation-error';
import isPlainObject from '../utils/is-plain-object';
import typeOf from '../utils/type-of';

export const LINKS_ERROR_TYPES = {
  UNKNOWN_MEMBER: uniqueErrorId(),
  INVALID_MEMBER: uniqueErrorId(),
  VALUE_MUST_BE_OBJECT: uniqueErrorId(),
  OBJECT_MUST_NOT_BE_EMPTY: uniqueErrorId(),
};

export class LinksError extends ValidationError {
  constructor(options) {
    let { value, path, document } = options;
    const errorLocation = createNiceErrorMessage({
      key: Array.isArray(value) ? '' : value,
      value: isPlainObject(document) ? JSON.stringify(document) : document,
      path,
      code: NICE_ERROR_TYPES.OBJECT_ERROR,
    });
    const error = buildMetaErrorMessage(options);
    const message = error + errorLocation;
    super(message);
  }
}

function buildMetaErrorMessage(options) {
  let { value, code, member, path } = options;

  switch (code) {
    case LINKS_ERROR_TYPES.INVALID_MEMBER:
      return `'${path}.${member}' MUST NOT be undefined.`;

    case LINKS_ERROR_TYPES.VALUE_MUST_BE_OBJECT:
      return `'${path}.${member}' MUST be an object when present: found value of type ${typeOf(
        value
      )}`;

    case LINKS_ERROR_TYPES.OBJECT_MUST_NOT_BE_EMPTY:
      return `'${path}.${member}' MUST have at least one member: found an empty object.`;
  }

  return 'DocumentError';
}
