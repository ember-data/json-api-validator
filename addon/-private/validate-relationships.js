import { dasherize } from '@ember/string';
import { RELATIONSHIP_ERROR_TYPES, RelationshipError } from './errors/relationship-error';

export default function validateResourceRelationships(schema, relationships, methodName, path = '') {
  if (typeof relationships !== 'object' || relationships === null) {
    let error = new RelationshipError(RELATIONSHIP_ERROR_TYPES.INVALID_HASH, schema.type, 'relationships', relationships, path);

    return [error];
  }

  let foundRelationshipKeys = Object.keys(relationships);
  let errors = [];

  for (let i = 0; i < foundRelationshipKeys.length; i++) {
    let key = foundRelationshipKeys[i];
    let data = relationships[key];
    errors = errors.concat(validateResourceRelationship(schema, key, data));
  }

  return errors;
}

function validateResourceRelationship(schema, propertyName, data, path) {
  let relationship = _findRelationship(schema, propertyName);
  let errors = [];

  if (relationship === undefined) {
    errors.push(new RelationshipError(RELATIONSHIP_ERROR_TYPES.UNKNOWN_RELATIONSHIP, schema.type, propertyName, data, path));
  } else {
    if (typeof data !== 'object') {
      errors.push(new Error(`The data for ${propertyName} on ${schema.type} is not an object`));
    } else if (data !== null) {
      if (data.hasOwnProperty('links')) {
        if (typeof data.links !== 'object') {
          errors.push(new Error(`The links for the relationship ${propertyName} on ${schema.type} is not an object or null`));
        }
      }
      if (data.hasOwnProperty('meta')) {
        if (typeof data.meta !== 'object') {
          errors.push(new Error(`The meta for the relationship ${propertyName} on ${schema.type} is not an object or null`));
        }
      }
      if (data.hasOwnProperty('data')) {
        if (typeof data.data !== 'object') {
          errors.push(new Error(`The data for the relationship ${propertyName} on ${schema.type} is not an object or null`));
        } else if (data.data !== null) {
          if (relationship.kind === 'hasMany') {
            if (!Array.isArray(data.data)) {
              errors.push(new Error(`The data for the hasMany relationship ${propertyName} on ${schema.type} is not an array`));
            } else {
              data.data.forEach((ref) => {
                errors = errors.concat(validateRelationshipReference(relationship, ref));
              });
            }
          } else {
            // TODO belongsTo support
          }
        }
      }
    }
  }

  return errors;
}

function validateRelationshipReference(relationship, ref) {
  let errors = [];

  if (typeof ref.id !== 'string' || ref.id.length === 0) {
    errors.push(new Error(`Missing id on ref`));
  }

  if (typeof ref.type !== 'string' || ref.type.length === 0) {
    errors.push(new Error(`Missing type on ref`));
  } else {
    let foundType = dasherize(ref.type);

    if (foundType !== ref.type) {
      errors.push(new Error(`type should be dasherized`));
    }

    let type = relationship.schema;
    let schema = schemaFor(type);
    let isCorrectType = foundType === type;

    while (!isCorrectType && schema.inherits) {
      schema = schemaFor(schema.inherits);
      isCorrectType = foundType === schema.type;
    }

    if (!isCorrectType) {
      errors.push(new Error(`reference type is not valid for this relationship`));
    }
  }

  return errors;
}

function _findRelationship(schema, propertyName) {
  let relTypes = ['hasMany', 'belongsTo'];

  for (let i = 0; i < relTypes.length; i++) {
    let kind = relTypes[i];
    let arr = schema[kind];

    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].key === propertyName) {
          let meta = arr[i];
          meta.kind = kind;
          meta.for = schema.type;
          return meta;
        }
      }
    }
  }

  if (schema.inherits) {
    return _findRelationship(schemaFor(schema.inherits), propertyName);
  }

  return undefined;
}
