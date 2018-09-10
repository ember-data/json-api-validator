import { ValidationError, createNiceErrorMessage, uniqueErrorId } from './validation-error';

import * as JSON from 'json-typescript';

export const RESOURCE_ERROR_TYPES = {
  RESOURCE_MISSING: uniqueErrorId(),
  RESOURCE_IS_ARRAY: uniqueErrorId(),
  INVALID_RESOURCE: uniqueErrorId(),
  UNEXPECTED_KEY: uniqueErrorId(),
  MISSING_KEY: uniqueErrorId(),
  MISSING_INFO: uniqueErrorId(),
  INVALID_ID_VALUE: uniqueErrorId(),
  INVALID_TYPE_VALUE: uniqueErrorId(),
  INVALID_TYPE_FORMAT: uniqueErrorId(),
  UNKNOWN_SCHEMA: uniqueErrorId()
};

export class ResourceError extends ValidationError {
  constructor(errorType: number, type: string, propertyName: string, value: JSON.Value, path: string) {
    let errorLocation = '';

    if (
      errorType !== RESOURCE_ERROR_TYPES.RESOURCE_MISSING &&
      errorType !== RESOURCE_ERROR_TYPES.RESOURCE_IS_ARRAY &&
      errorType !== RESOURCE_ERROR_TYPES.MISSING_INFO
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

function buildPrimaryResourceErrorMessage(errorType: number, type: string, propertyName: string, value: JSON.Value) {
  switch (errorType) {
    case RESOURCE_ERROR_TYPES.RESOURCE_MISSING:
      return `Expected to receive a json-api resource${propertyName ? ' at ' + propertyName : ''} but instead found '${value}'.`;

    case RESOURCE_ERROR_TYPES.RESOURCE_IS_ARRAY:
      return `Expected to receive a single json-api resource${propertyName ? ' at ' + propertyName : ''} but instead found an Array.`;

    case RESOURCE_ERROR_TYPES.INVALID_RESOURCE:
      return `Expected to receive a json-api resource${propertyName ? ' at ' + propertyName : ''} but instead found '${value}'.`;

    case RESOURCE_ERROR_TYPES.UNEXPECTED_KEY:
      return `Unexpected key in payload: ${propertyName}`;

    case RESOURCE_ERROR_TYPES.MISSING_KEY:
      return `Missing mandatory key in payload: ${propertyName}`;

    case RESOURCE_ERROR_TYPES.MISSING_INFO:
      return `In addition to 'type' and 'id', a resource needs at least one of the following keys: ${value}`;

    case RESOURCE_ERROR_TYPES.INVALID_ID_VALUE:
    case RESOURCE_ERROR_TYPES.INVALID_TYPE_VALUE:
      return `Resource.${propertyName} must be a string, found ${value}`;

    case RESOURCE_ERROR_TYPES.INVALID_TYPE_FORMAT:
      return `Expected resource type to be dasherized, found '${value}' instead of '${type}'.`;

    case RESOURCE_ERROR_TYPES.UNKNOWN_SCHEMA:
      return `Unknown resource, no schema was found for type '${value}'`;
    default:
      return `Unknown errorType: ${errorType}. type: ${type}, propertName: ${propertyName}, value: ${value}`;
  }
}
