import { DocumentError, DOCUMENT_ERROR_TYPES} from './errors/document-error';
import validateMeta from './validate-meta';

/**
 * Validate that a json-api document conforms to spec
 *
 *  Spec: http://jsonapi.org/format/#document-top-level
 *
 * @param validator
 * @param document
 * @param {Array} errors
 * @param {String} path
 *
 * @returns {Array}
 */
export default function _validateDocument(validator, document, errors = [], path = '') {
  if (itExists(validator, document, errors, path)) {
    itHasAtLeastOne(validator, document, errors, path);
    itHasAtLeastOneNonNull(validator, document, errors, path);
    itHasDataOrErrorsWithMeta(validator, document, errors, path);
    itCantHaveBoth(validator, document, errors, path);
    // itDoesntHaveMoreThan(validator, document, errors, path);
    // includedMustHaveData(validator, document, errors, path);
    // validateMeta(validator, document, errors, path);
    // validateVersion(validator, document, errors, path);
    // validateData(validator, document, errors, path);
    // validateLinks(validator, document, errors, path);
    // validateIncluded(validator, document, errors, path);
    // validateErrors(validator, document, errors, path);
  }

  return errors;
}

/**
 * Validates that a document is an object
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 */
function itExists(validator, document, errors, path) {
  let type = typeof document;

  if (type !== 'object' || document === null || document instanceof Date) {
    errors.push(new DocumentError({
      document,
      path,
      code: DOCUMENT_ERROR_TYPES.INVALID_DOCUMENT,
      validator,
      value: type
    }));
    return false;
  }

  return true;
}

const AT_LEAST_ONE = [
  'data',
  'meta',
  'errors'
];

/**
 * Validates that a document has at least one of
 * the following keys: `data`, `meta`, and `errors`.
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 */
function itHasAtLeastOne(validator, document, errors, path) {
  for (let i = 0; i < AT_LEAST_ONE.length; i++) {
    let neededKey = AT_LEAST_ONE[i];

    if (document.hasOwnProperty(neededKey) && document[neededKey] !== undefined) {
      return true;
    }
  }

  errors.push(new DocumentError({
    document,
    path,
    code: DOCUMENT_ERROR_TYPES.MISSING_MANDATORY_MEMBER,
    validator,
    value: AT_LEAST_ONE
  }));

  return false;
}

function keyPresent(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;
}

function keyPresentAndNotNull(obj, key) {
  return keyPresent(obj, key) && obj[key] !== null;
}

/**
 * Validates that a document has at least one of
 * the following keys: `data`, `meta`, and `errors`
 * and that the key is non-null
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 */
function itHasAtLeastOneNonNull(validator, document, errors, path) {
  let nullMembers = [];
  for (let i = 0; i < AT_LEAST_ONE.length; i++) {
    let neededKey = AT_LEAST_ONE[i];

    if (keyPresentAndNotNull(document, neededKey)) {
      return true;
    } else if (keyPresent(document, neededKey)) {
      nullMembers.push(neededKey);
    }
  }

  if (nullMembers.length) {
    errors.push(new DocumentError({
      document,
      path,
      code: DOCUMENT_ERROR_TYPES.NULL_MANDATORY_MEMBER,
      validator,
      key: nullMembers,
      value: AT_LEAST_ONE
    }));
  }

  return false;
}

/**
 * Validates that a document has data or errors in addition to meta
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 */
function itHasDataOrErrorsWithMeta(validator, document, errors, path) {
  let msg = validator.disallowOnlyMetaDocument();

  if (msg === false) {
    return true;
  }

  if (!document.hasOwnProperty('meta')) {
    return true;
  }

  if (keyPresentAndNotNull(document, 'data') || keyPresentAndNotNull(document, 'errors')) {
    return true;
  }

  errors.push(new DocumentError({
    document,
    path,
    code: DOCUMENT_ERROR_TYPES.DISALLOWED_SOLITARY_META_MEMBER,
    validator,
    value: msg
  }));

  return false;
}

/**
 * Validates that a document does not have both data and errors
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 */
function itCantHaveBoth(validator, document, errors, path) {
  if (document.hasOwnProperty('data') && document.hasOwnProperty('errors')) {
    errors.push(new DocumentError({
      document,
      path,
      code: DOCUMENT_ERROR_TYPES.DISALLOWED_DATA_MEMBER,
      validator,
      value: ['data', 'errors']
    }));

    return false;
  }

  return true;
}

const OPTIONAL_KEYS = [
  'jsonapi',
  'links',
  'included'
];
/**
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
function itDoesntHaveMoreThan(validator, document, errors, path) {
  let hasError = false;

  Object.keys(document).forEach(key => {
    if (OPTIONAL_KEYS.indexOf(key) === -1 && AT_LEAST_ONE.indexOf(key) === -1) {
      errors.push(new DocumentError(DOCUMENT_ERROR_TYPES.UNKNOWN_MEMBER, key, document));
      hasError = true;
    }
  });

  return !hasError;
}

/**
 * Spec: http://jsonapi.org/format/#document-top-level
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
function includedMustHaveData(validator, document, errors, path) {
  if (document.hasOwnProperty('included') && !document.hasOwnProperty('data')) {
    errors.push(new DocumentError(DOCUMENT_ERROR_TYPES.DISALLOWED_INCLUDED_MEMBER, 'included', document));
    return false;
  }
  return true;
}

/**
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
function validateVersion(validator, document, errors, path) {
  let hasError = false;

  if (hasKey(document, 'jsonapi')) {
    if (typeof document.jsonapi !== 'object' || document.jsonapi === null) {
      errors.push(new DocumentError(DOCUMENT_ERROR_TYPES.VALUE_MUST_BE_OBJECT, 'jsonapi', document));

    } else {
      let keys = Object.keys(document.jsonapi);

      /*
        The spec allows this to be empty, but we are more strict. If the jsonapi
        property is defined we expect it to have information.
       */
      if (keys.length === 0) {


      } else {

        /*
          The spec only allows for 'version' and 'meta'.
         */
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];

          if (key === 'version') {
            if (typeof document.jsonapi.version !== 'string' || document.jsonapi.version.length === 0) {
              errors.push(new DocumentError(DOCUMENT_ERROR_TYPES.VERSION_MUST_BE_STRING, 'version', document.jsonapi, 'jsonapi'));
              hasError = true;
            }

          } else if (key === 'meta') {
            hasError = !validateMeta(document.jsonapi, errors, 'jsonapi') || hasError;

          } else {
            errors.push(new DocumentError(DOCUMENT_ERROR_TYPES.UNKNOWN_MEMBER, key, document.jsonapi, 'jsonapi'));
            hasError = true;
          }
        }
      }
    }
  }

  return !hasError;
}

/**
 * The `data` key of a json-api document must contain either
 *
 * 1) an object representing either
 *    a) a resource-identifier (Reference) with type, id, and optional meta
 *    b) a resource-object (Resource) with type, id and optional meta, links, attributes, and relationships
 * 2) an array consisting of either
 *    c) entirely resource-identifiers
 *    d) entirely resource-objects
 *
 * Because of ambiguity in the json-api spec allowing for resource-object's without attributes and relationships
 * to look suspiciously similar to resource-identifiers we define that a resource-object MUST have AT LEAST ONE
 * of `attributes`, `relationships`, or `links`.
 *
 * Spec - ResourceObject: http://jsonapi.org/format/#document-resource-objects
 * Spec - ResourceIdentifier: http://jsonapi.org/format/#document-resource-identifier-objects
 *
 * This also means that a resource-identifier MUST NOT have links, which is supported by the spec but appears
 * to be violated in many real-world applications.
 *
 * For further reading on how we validate the structure of a resource see the `validateResource` method.
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
function validateData(validator, document, errors, path) {
  return true;
}

/**
 * The `included` key of a json-api document MUST be an Array if present and MUST contain only
 * resource-objects (Resource).
 *
 * Every resource-object in included MUST be linked to
 * by another resource-object within the payload, see:
 *
 * http://jsonapi.org/format/#document-compound-documents
 *
 * However, exceptions are made for for sparse fieldsets
 * which makes this difficult to enforce.
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
function validateIncluded(validator, document, errors, path) {
  if (hasKey(document, 'included')) {
    if (!Array.isArray(document.included)) {
      // TODO error
      return false;
    }

    let inc = document.included;
    let hasError = false;

    for (let i = 0; i < inc.length; i++) {
      if (!isValidResourceStructure(inc[i])) {
        // TODO error
        hasError = true;
      } else {
        // TODO validate resource
        // TODO add warnings, warn if not linked in same doc
      }
    }

    return !hasError;
  }

  return true;
}

/**
 * MUST be an array of error-objects
 *
 *  See: http://jsonapi.org/format/#error-objects
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
function validateErrors(validator, document, errors, path) {
  if (hasKey(document, 'errors')) {
    return !Array.isArray(document.errors);
  }

  return true;
}

/**
 * `links` MUST be an object if present
 * each member MUST be a string URL or a link-object
 * each link-object MUST have an `href` string URL
 *   and MAY  have a meta object.
 *
 * For top level documents (here), the links-object MAY contain
 *
 * - self: the link to the current document
 * - related: when the data represents a resource relationship
 * - pagination links: for the primary data
 *
 * The following keys MUST be used for pagination links:
 *
 * first: the first page of data
 * last: the last page of data
 * prev: the previous page of data
 * next: the next page of data
 *
 * Keys MUST either be omitted or have a `null` value to indicate that a particular link is unavailable.
 *
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
function validateLinks(validator, document, errors, path) {
  return true;
}

function hasKey(document, key) {
  return Object.keys(document).indexOf(key) !== -1;
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

const ID_KEYS = ['type', 'id'];
const ALLOWED_KEYS = ['meta'];
const RESOURCE_KEYS = ['links', 'attributes', 'relationships'];
const ALL_REFERENCE_KEYS = [].concat(ID_KEYS, ALLOWED_KEYS);
const ALL_RESOURCE_KEYS = [].concat(ALL_REFERENCE_KEYS, RESOURCE_KEYS);

/**
 * Loosely determine if an object might be a resource
 *
 * @param obj
 * @returns {boolean}
 */
function isValidResourceStructure(obj) {
  if (!isObject(obj)) {
    return false;
  }

  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    if (ALL_RESOURCE_KEYS.indexOf(key) === -1) {
      return false;
    }
  }

  for (let i = 0; i < ID_KEYS.length; i++) {
    let key = ID_KEYS[i];

    if (!obj.hasOwnProperty(key)) {
      return false;
    }
  }

  for (let i = 0; i < RESOURCE_KEYS.length; i++) {
    let key = RESOURCE_KEYS[i];

    if (obj.hasOwnProperty(key)) {
      return true;
    }
  }

  return false;
}

/**
 * Loosely determine if an object might be a Reference
 *
 * @param obj
 * @returns {boolean}
 */
function isValidReferenceStructure(obj) {
  if (!isObject(obj)) {
    return false;
  }

  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    if (ALL_REFERENCE_KEYS.indexOf(key) === -1) {
      return false;
    }
  }

  for (let i = 0; i < ID_KEYS.length; i++) {
    let key = ID_KEYS[i];

    if (!obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}
