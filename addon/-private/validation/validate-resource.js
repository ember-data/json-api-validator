import { dasherize } from 'json-api-validations/-private/utils/dasherize';
import validateResourceRelationships from './validate-relationships';
import validateResourceAttributes from './validate-attributes';
import coalesceAndThrowErrors from './coalesce-errors';
import { RESOURCE_ERROR_TYPES, ResourceError } from './errors/resource-error';

const _EXPECTED_RESOURCE_KEYS = [
  'id', 'type', 'attributes', 'relationships','links', 'meta'
];
const _MANDATORY_PRIMARY_RESOURCE_KEYS = [
  'id', 'type'
];
const _MANDATORY_SECONDARY_RESOURCE_KEYS = [
  'attributes', 'relationships'
];

export default function validateResource(resource, methodName, path) {
  let errors = [];

  if (!resource) {
    errors.push(new ResourceError(RESOURCE_ERROR_TYPES.RESOURCE_MISSING, undefined, undefined, resource, path));

  } else if (Array.isArray(resource)) {
    errors.push(new ResourceError(RESOURCE_ERROR_TYPES.RESOURCE_IS_ARRAY, undefined, undefined, resource, path));

  } else if (typeof resource !== 'object') {
    errors.push(new ResourceError(RESOURCE_ERROR_TYPES.INVALID_RESOURCE, undefined, undefined, resource, path));

  } else {
    errors = errors.concat(detectStructuralErrors(resource, methodName, path));
    errors = errors.concat(detectTypeErrors(resource, methodName, path));
  }

  coalesceAndThrowErrors(errors);
}

function detectStructuralErrors(payload, methodName, path) {
  let resourceKeys = Object.keys(payload);
  let errors = [];

  for (let i = 0; i < resourceKeys.length; i++) {
    let key = resourceKeys[i];

    if (_EXPECTED_RESOURCE_KEYS.indexOf(key) === -1) {
      errors.push(new ResourceError(RESOURCE_ERROR_TYPES.UNEXPECTED_KEY, undefined, key, payload[key], path));
    }
  }

  for (let i = 0; i < _MANDATORY_PRIMARY_RESOURCE_KEYS.length; i++) {
    let key = _MANDATORY_PRIMARY_RESOURCE_KEYS[i];

    if (resourceKeys.indexOf(key) === -1) {
      errors.push(new ResourceError(RESOURCE_ERROR_TYPES.MISSING_KEY, undefined, key, payload, path));
    }
  }

  let foundSecondaryKey = false;
  for (let i = 0; i < _MANDATORY_SECONDARY_RESOURCE_KEYS.length; i++) {
    let key = _MANDATORY_SECONDARY_RESOURCE_KEYS[i];

    if (resourceKeys.indexOf(key) !== -1) {
      foundSecondaryKey = true;
      break;
    }
  }

  if (foundSecondaryKey === false) {
    errors.push(new ResourceError(RESOURCE_ERROR_TYPES.MISSING_INFO, payload.type, undefined, _MANDATORY_SECONDARY_RESOURCE_KEYS.join(', '), path));
  }

  return errors;
}

function detectTypeErrors(resource, methodName, path) {
  let schema;
  let errors = [];

  if (typeof resource.id !== 'string' || resource.id.length === 0) {
    errors.push(new ResourceError(RESOURCE_ERROR_TYPES.INVALID_ID_VALUE, undefined, 'id', resource.id, path));
  }
  if (typeof resource.type !== 'string' || resource.type.length === 0) {
    errors.push(new ResourceError(RESOURCE_ERROR_TYPES.INVALID_TYPE_VALUE, undefined, 'type', resource.type, path));

  } else {
    let dasherized = dasherize(resource.type);

    if (dasherized !== resource.type) {
      errors.push(new ResourceError(RESOURCE_ERROR_TYPES.INVALID_TYPE_FORMAT, dasherized, 'type', resource.type, path));
    }

    schema = schemaFor(dasherized);

    if (schema === undefined) {
      errors.push(new ResourceError(RESOURCE_ERROR_TYPES.UNKNOWN_SCHEMA, resource.type, 'type', resource.type, path));
    } else {
      if (resource.hasOwnProperty('attributes')) {
        errors = errors.concat(validateResourceAttributes(schema, resource.attributes, methodName, path));
      }
      if (resource.hasOwnProperty('relationships')) {
        errors = errors.concat(validateResourceRelationships(schema, resource.relationships, methodName, path));
      }
    }
  }

  return errors;
}
