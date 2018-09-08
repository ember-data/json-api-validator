import { AttributeError, ATTRIBUTE_ERROR_TYPES } from './errors/attribute-error';
import { schemaFor } from 'json-api-validations/setup-ember-data-validations';

export default function validateResourceAttributes(schema, attributes, methodName, path) {
  if (typeof attributes !== 'object' || attributes === null) {
    return [new Error(`Expected the attributes hash for a resource to be an object, found '${attributes}'`)];
  }

  let foundRelationshipKeys = Object.keys(attributes);
  let errors = [];

  for (let i = 0; i < foundRelationshipKeys.length; i++) {
    let key = foundRelationshipKeys[i];
    let data = attributes[key];
    let attr = findAttribute(schema, key);

    if (attr === undefined) {
      errors.push(new AttributeError(ATTRIBUTE_ERROR_TYPES.UNKNOWN_ATTRIBUTE, schema.type, key, data, path));
    }

    if (typeof data === 'undefined') {
      errors.push(new AttributeError(ATTRIBUTE_ERROR_TYPES.UNDEFINED_VALUE, schema.type, key, data, path));
    }
  }

  return errors;
}

export function findAttribute(schema, propertyName) {
  let arr = schema.attr;

  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === propertyName) {
        let meta = {};
        meta.key = propertyName;
        meta.kind = 'attribute';
        meta.for = schema.type;
        return meta;
      }
    }
  }

  if (schema.inherits) {
    schema
    return findAttribute(schemaFor(schema.inherits), propertyName);
  }

  return undefined;
}
