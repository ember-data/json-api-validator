import _validateDocument from './validation/validate-document';
import coalesceAndThrowErrors from './validation/coalesce-errors';
import assertTypeFormat from './utils/assert-type-format';
import assertMemberFormat from './utils/assert-member-format';
import normalizeType from './utils/normalize-type';

function _disallowOnlyMetaDocument() { return false; }

export default class JSONAPIValidator {
  constructor(hooks) {
    this.strictMode = !!hooks.strictMode || true;
    this.schemaFor = hooks.schemaFor;
    this.schemaImplements = hooks.schemaImplements;
    this.formatFallbackType = hooks.formatFallbackType;

    // each one of these hooks should be considered an Ember Data bug
    //  since they are only necessary due to Ember Data bugs

    /*
      Ember Data  strictly requires singularized, dasherized types
     */
    this.disallowOnlyMetaDocument = hooks.disallowOnlyMetaDocument || _disallowOnlyMetaDocument;
    this.assertTypeFormat = hooks.assertTypeFormat || assertTypeFormat;
    this.assertMemberFormat = hooks.assertMemberFormat || assertMemberFormat;
    this.formatType = hooks.formatType || normalizeType;
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
    let issues = _validateDocument(this, document);

    coalesceAndThrowErrors(issues);
  }
}
