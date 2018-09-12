import { ValidationError, createNiceErrorMessage, uniqueErrorId } from './validation-error';

export const ATTRIBUTE_ERROR_TYPES = {
  INVALID_HASH: uniqueErrorId(),
  UNKNOWN_ATTRIBUTE: uniqueErrorId(),
  UNDEFINED_VALUE: uniqueErrorId(),
  INCORRECT_VALUE_TYPE: uniqueErrorId(),
};

export class AttributeError extends ValidationError {
  constructor(errorType, type, propertyName, value, path) {
    const errorLocation = createNiceErrorMessage(
      propertyName,
      value,
      errorType === ATTRIBUTE_ERROR_TYPES.INVALID_HASH ? path : (path ? path + '.attributes' : 'attributes'),
      errorType === ATTRIBUTE_ERROR_TYPES.UNKNOWN_ATTRIBUTE,
    );
    const error = buildPrimaryAttributeErrorMessage(errorType, type, propertyName, value);
    const message = error + errorLocation;
    super(message);
  }
}

function buildPrimaryAttributeErrorMessage(errorType, type, propertyName, value) {
  switch (errorType) {
    case ATTRIBUTE_ERROR_TYPES.INVALID_HASH:
      return `Expected the attributes hash for a resource to be an object, found '${value}' for type '${type}'`;

    case ATTRIBUTE_ERROR_TYPES.UNKNOWN_ATTRIBUTE:
      return `The attribute '${propertyName}' does not exist on the schema for type '${type}'`;

    case ATTRIBUTE_ERROR_TYPES.UNDEFINED_VALUE:
      return `undefined is not a valid value for the attribute '${propertyName}' on a resource of type '${type}'. To indicate empty, deleted, or un-set use null.`;

    case ATTRIBUTE_ERROR_TYPES.INCORRECT_VALUE_TYPE:
      return `An unclassified error occurred while validating the attribute '${propertyName}' on a resource of type '${type}'`;

    default:
      return `An unclassified error occurred while validating the attribute '${propertyName}' for a resource of type '${type}'`;
  }
}
