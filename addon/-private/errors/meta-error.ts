import {
  NICE_ERROR_TYPES,
  ValidationError,
  createNiceErrorMessage,
  uniqueErrorId,
} from './validation-error';
import aboutAnOxfordComma from '../utils/about-an-oxford-comma';
import isPlainObject from '../utils/is-plain-object';
import typeOf from '../utils/type-of';
import { IErrorOptions } from 'ember-data';

export const META_ERROR_TYPES = {
  DISALLOWED_SOLITARY_META_MEMBER: uniqueErrorId(),
  INVALID_MEMBER: uniqueErrorId(),
  VALUE_MUST_BE_OBJECT: uniqueErrorId(),
  OBJECT_MUST_NOT_BE_EMPTY: uniqueErrorId(),
};

export class MetaError extends ValidationError {
  constructor(options: IErrorOptions) {
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
  let { value, code, member, path, expectedValue } = options;

  switch (code) {
    case META_ERROR_TYPES.DISALLOWED_SOLITARY_META_MEMBER:
      return `'${path}.${member}' MUST NOT be the only member of '${path}. Expected ${aboutAnOxfordComma(
        expectedValue
      )} as a sibling.`;

    case META_ERROR_TYPES.INVALID_MEMBER:
      return `'${path}.${member}' MUST NOT be undefined.`;

    case META_ERROR_TYPES.VALUE_MUST_BE_OBJECT:
      return `'${path}.${member}' MUST be an object when present: found value of type ${typeOf(
        value
      )}`;

    case META_ERROR_TYPES.OBJECT_MUST_NOT_BE_EMPTY:
      return `'${path}.${member}' MUST have at least one member: found an empty object.`;
  }

  return 'DocumentError';
}
