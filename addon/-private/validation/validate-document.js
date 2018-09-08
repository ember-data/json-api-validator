import itExists from './document-rules/it-exists';
import itHasAtLeastOne from './document-rules/it-has-at-least-one';
import itHasAtLeastOneNonNull from './document-rules/it-has-at-least-one-non-null';
import itHasDataOrErrorsWithMeta from './document-rules/it-has-data-or-error-with-meta';
import itCantHaveBoth from './document-rules/it-cant-have-both';
import itHasNoUnknownMembers from './document-rules/it-has-no-unknown-members';
import includedMustHaveData from './document-rules/included-must-have-data';
import validateJsonapiMember from './validate-jsonapi-member';
import validateMeta from './validate-meta';

//import memberPresent from '../utils/member-present';
//import isPlainObject from '../utils/is-plain-object';

/**
 * Validate that a json-api document conforms to spec
 *
 *  Spec: http://jsonapi.org/format/#document-top-level
 *
 * @param validator
 * @param document
 * @param {Array} issues
 * @param {String} path
 *
 * @returns {Object} an object with arrays of `errors` and `warnings`.
 */
export default function _validateDocument({ validator, document, issues, path = '' }) {
  issues = issues || {
    errors: [],
    warnings: [],
  };

  let validationContext = { validator, document, issues, path };

  if (itExists(validationContext)) {
    itHasAtLeastOne(validationContext);
    itHasAtLeastOneNonNull(validationContext);
    itHasDataOrErrorsWithMeta(validationContext);
    itCantHaveBoth(validationContext);
    itHasNoUnknownMembers(validationContext);
    includedMustHaveData(validationContext);
    validateJsonapiMember(validationContext);
    validateMeta(validationContext);
    // validateData(validator, document, errors, path);
    // validateLinks(validator, document, errors, path);
    // validateIncluded(validator, document, errors, path);
    // validateErrors(validator, document, errors, path);
  }

  return issues;
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
// function validateData(validator, document, errors, path) {
//  return true;
// }

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
//  */
// function validateIncluded(validator, document, errors /*, path*/) {
//   if (memberPresent(document, 'included')) {
//     if (!Array.isArray(document.included)) {
//       // TODO error
//       return false;
//     }

//     let inc = document.included;
//     let hasError = false;

//     for (let i = 0; i < inc.length; i++) {
//       if (!isValidResourceStructure(inc[i])) {
//         // TODO error
//         hasError = true;
//       } else {
//         // TODO validate resource
//         // TODO add warnings, warn if not linked in same doc
//       }
//     }

//     return !hasError;
//   }

//   return true;
// }

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
// function validateErrors(validator, document, errors, path) {
//   if (memberPresent(document, 'errors')) {
//     return !Array.isArray(document.errors);
//   }

//   return true;
// }

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
// function validateLinks(validator, document, errors, path) {
//   return true;
// }

//const ID_KEYS = ['type', 'id'];
//const ALLOWED_KEYS = ['meta'];
//const RESOURCE_KEYS = ['links', 'attributes', 'relationships'];
//const ALL_REFERENCE_KEYS = [].concat(ID_KEYS, ALLOWED_KEYS);
//const ALL_RESOURCE_KEYS = [].concat(ALL_REFERENCE_KEYS, RESOURCE_KEYS);

/**
 * Loosely determine if an object might be a resource
 *
 * @param obj
 * @returns {boolean}
 */
// function isValidResourceStructure(obj) {
//   if (!isPlainObject(obj)) {
//     return false;
//   }

//   let keys = Object.keys(obj);
//   for (let i = 0; i < keys.length; i++) {
//     let key = keys[i];

//     if (ALL_RESOURCE_KEYS.indexOf(key) === -1) {
//       return false;
//     }
//   }

//   for (let i = 0; i < ID_KEYS.length; i++) {
//     let key = ID_KEYS[i];

//     if (!memberPresent(obj, key)) {
//       return false;
//     }
//   }

//   for (let i = 0; i < RESOURCE_KEYS.length; i++) {
//     let key = RESOURCE_KEYS[i];

//     if (memberPresent(obj, key)) {
//       return true;
//     }
//   }

//   return false;
// }

/**
 * Loosely determine if an object might be a Reference
 *
 * @param obj
 * @returns {boolean}
 */
// function isValidReferenceStructure(obj) {
//   if (!isPlainObject(obj)) {
//     return false;
//   }

//   let keys = Object.keys(obj);
//   for (let i = 0; i < keys.length; i++) {
//     let key = keys[i];

//     if (ALL_REFERENCE_KEYS.indexOf(key) === -1) {
//       return false;
//     }
//   }

//   for (let i = 0; i < ID_KEYS.length; i++) {
//     let key = ID_KEYS[i];

//     if (!memberPresent(obj, key)) {
//       return false;
//     }
//   }

//   return true;
// }
