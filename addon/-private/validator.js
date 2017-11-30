import dasherize from './utils/dasherize';
import _validateDocument from './validation/validate-document';
import coalesceAndThrowErrors from './validation/coalesce-errors';

function formatType(type) {
  return dasherize(type);
}

function isDasherized(type) {
 let dasherized = dasherize(type);

  return dasherized === type;
}

function assertTypeFormat(type, formatter, mode) {
  let formattedType = formatter(type);
  let errors = [];

  if (type !== formattedType) {
    errors.push('yes');
  }

  if (mode === 'dasherize') {
    if (!isDasherized(type)) {
      errors.push('dasherize');
    }
  } else if (mode === 'not-dasherized') {
    if (isDasherized(type)) {
      errors.push('whoops, dasherized');
    }
  }
}

function _disallowOnlyMetaDocument() { return false; }

export default class JSONAPIValidator {
  constructor(hooks) {
    this.schemaFor = hooks.schemaFor;
    this.isSubclassOf = hooks.isSubclassOf;
    this.formatFallbackType = hooks.formatFallbackType;

    // each one of these hooks should be considered an Ember Data bug
    //  since they are only necessary due to Ember Data bugs

    /*
      Ember Data  strictly requires singularized, dasherized types
     */
    this.disallowOnlyMetaDocument = hooks.disallowOnlyMetaDocument || _disallowOnlyMetaDocument;
    this.assertTypeFormat = hooks.assertTypeFormat || assertTypeFormat;
    this.formatType = hooks.formatType || formatType;
  }

  /**
   * Validate that a json-api document conforms to spec
   *
   *  Spec: http://jsonapi.org/format/#document-top-level
   *
   * @param document
   * @returns {Array}
   */
  validateDocument(document) {
    let errors = _validateDocument(this, document);

    coalesceAndThrowErrors(errors);
  }
}
