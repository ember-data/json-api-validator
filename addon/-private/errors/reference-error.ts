import { ValidationError, createNiceErrorMessage, uniqueErrorId } from './validation-error';

import * as JSON from 'json-typescript';

export const REFERENCE_ERROR_TYPES = {
  REFERENCE_MISSING: uniqueErrorId(),
  REFERENCE_IS_ARRAY: uniqueErrorId(),
  INVALID_REFERENCE: uniqueErrorId(),
  UNEXPECTED_KEY: uniqueErrorId(),
  MISSING_KEY: uniqueErrorId(),
  MISSING_INFO: uniqueErrorId(),
  INVALID_ID_VALUE: uniqueErrorId(),
  INVALID_TYPE_VALUE: uniqueErrorId(),
  INVALID_TYPE_FORMAT: uniqueErrorId(),
  UNKNOWN_SCHEMA: uniqueErrorId()
};

export class ReferenceError extends ValidationError {
  constructor(errorType: number, type: string, propertyName: string, value: JSON.Value, path: string) {
    let errorLocation = '';

    if (
      errorType !== REFERENCE_ERROR_TYPES.REFERENCE_MISSING &&
      errorType !== REFERENCE_ERROR_TYPES.REFERENCE_IS_ARRAY &&
      errorType !== REFERENCE_ERROR_TYPES.MISSING_INFO
    ) {
      errorLocation = createNiceErrorMessage(
        propertyName,
        value,
        path,
        false,
      );
    }
    const error = buildPrimaryResourceErrorMessage(errorType, type, propertyName || path, value);
    const message = error + errorLocation;
    super(message);
  }
}

function buildPrimaryResourceErrorMessage(errorType, type, propertyName, value) {
  switch (errorType) {
    case REFERENCE_ERROR_TYPES.REFERENCE_MISSING:
      return `Expected to receive a json-api reference${propertyName ? ' at ' + propertyName : ''} but instead found '${value}'.`;

    case REFERENCE_ERROR_TYPES.REFERENCE_IS_ARRAY:
      return `Expected to receive a single json-api reference${propertyName ? ' at ' + propertyName : ''} but instead found an Array.`;

    case REFERENCE_ERROR_TYPES.INVALID_REFERENCE:
      return `Expected to receive a json-api reference${propertyName ? ' at ' + propertyName : ''} but instead found '${value}'.`;

    case REFERENCE_ERROR_TYPES.UNEXPECTED_KEY:
      return `Unexpected key in payload: ${propertyName}`;

    case REFERENCE_ERROR_TYPES.MISSING_KEY:
      return `Missing mandatory key in payload: ${propertyName}`;

    case REFERENCE_ERROR_TYPES.MISSING_INFO:
      return `In addition to 'type' and 'id', a reference needs at least one of the following keys: ${value}`;

    case REFERENCE_ERROR_TYPES.INVALID_ID_VALUE:
    case REFERENCE_ERROR_TYPES.INVALID_TYPE_VALUE:
      return `Resource.${propertyName} must be a string, found ${value}`;

    case REFERENCE_ERROR_TYPES.INVALID_TYPE_FORMAT:
      return `Expected reference type to be dasherized, found '${value}' instead of '${type}'.`;

    case REFERENCE_ERROR_TYPES.UNKNOWN_SCHEMA:
      return `Unknown reference, no schema was found for type '${value}'`;
  }
}
