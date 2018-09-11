import { ValidationError, createNiceErrorMessage, uniqueErrorId } from './validation-error';

import { Value } from 'json-typescript';

export const RELATIONSHIP_ERROR_TYPES = {
  INVALID_HASH: uniqueErrorId(),
  UNKNOWN_RELATIONSHIP: uniqueErrorId(),
  UNDEFINED_VALUE: uniqueErrorId(),
  INCORRECT_VALUE_TYPE: uniqueErrorId(),
  MALFORMATTED_TYPE: uniqueErrorId(),
};

export class RelationshipError extends ValidationError {
  constructor(errorType: number, type: string, propertyName: string, value: Value, path: string) {
    const errorLocation = createNiceErrorMessage(
      propertyName,
      value,
      errorType === RELATIONSHIP_ERROR_TYPES.INVALID_HASH ? path : (path ? path + '.relationships' : 'relationships'),
      errorType === RELATIONSHIP_ERROR_TYPES.UNKNOWN_RELATIONSHIP
      );
    const error = buildPrimaryRelationshipErrorMessage(errorType, type, propertyName, value);
    const message = error + errorLocation;
    super(message);
  }
}

function buildPrimaryRelationshipErrorMessage(errorType: number, type: string, propertyName: string, value: Value) {
  switch (errorType) {
    case RELATIONSHIP_ERROR_TYPES.INVALID_HASH:
      return `Expected the relationships hash for a resource to be an object, found '${value}' for type '${type}'`;

    case RELATIONSHIP_ERROR_TYPES.UNKNOWN_RELATIONSHIP:
      return `The relationship '${propertyName}' does not exist on the schema for type '${type}'`;

    case RELATIONSHIP_ERROR_TYPES.UNDEFINED_VALUE:
      return `undefined is not a valid value for the relationship '${propertyName}' on a resource of type '${type}'. To indicate empty, deleted, or un-set use null.`;

    case RELATIONSHIP_ERROR_TYPES.INCORRECT_VALUE_TYPE:
      return `An unclassified error occurred while validating the relationship '${propertyName}' on a resource of type '${type}'`;

    default:
      return `An unclassified error occurred while validating the relationship '${propertyName}' for a resource of type '${type}'`;
  }
}
