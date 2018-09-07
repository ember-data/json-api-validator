import _validateDocument from './validation/validate-document';
import coalesceAndThrowErrors from './validation/coalesce-errors';
import assertTypeFormat from './utils/assert-type-format';
import assertMemberFormat from './utils/assert-member-format';
import normalizeType from './utils/normalize-type';
import { dasherize } from '@ember/string';

function _disallowOnlyMetaDocument() {
  return 'ember-data does not enable json-api documents containing only `meta` as a member to be pushed to the store.';
}

export default class JSONAPIValidator {
  constructor(hooks) {
    /**
     * when strictMode is disabled, the following "innocuous"
     * errors become warnings.
     *
     * # Documents
     *
     * - empty `included`
     * - unknown members
     *
     * The following mistakes will still error
     *
     * # Documents
     *
     * - payloads that have no entries in `data` nor `included`
     *
     * @type {boolean} default `true`
     */
    this.strictMode = !!hooks.strictMode || true;
    this.schemaFor = hooks.schemaFor;
    this.schemaImplements = hooks.schemaImplements;

    // used to check for a schema by a slightly different name to be friendly
    this.formatFallbackType = hooks.formatFallbackType || dasherize;

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
