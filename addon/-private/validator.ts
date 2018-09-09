import _validateDocument from './validate-document';
import coalesceAndThrowErrors from './coalesce-errors';
import assertTypeFormat from './utils/assert-type-format';
import assertMemberFormat from './utils/assert-member-format';
import normalizeType from './utils/normalize-type';
import { dasherize } from '@ember/string';

import { Document } from 'jsonapi-typescript';
import { ISchema } from 'ember-data';



export interface IJSONAPIValidatorOptions {
  strictMode?: boolean;
  schemaFor: (type: string) => ISchema | undefined;
  schemaImplements: (subclassType: string, type: string) => boolean;
  formatFallbackType?: (value: string) => string;
  disallowMetaOnlyDocuments?: () => boolean;
  disallowMetaOnlyRelationships?: () => boolean;
  assertTypeFormat?: unknown;
  assertMemberFormat?: unknown;
  formatType?: unknown;
}

export default class JSONAPIValidator implements IJSONAPIValidatorOptions {
  strictMode?: boolean | undefined;
  schemaFor: (type: string) => ISchema | undefined;
  schemaImplements: (subclassType: string, type: string) => boolean;
  formatFallbackType?: ((value: string) => string) | undefined;
  disallowMetaOnlyDocuments?: (() => boolean) | undefined;
  disallowMetaOnlyRelationships?: (() => boolean) | undefined;
  assertTypeFormat?: unknown;
  assertMemberFormat?: unknown;
  formatType?: unknown;

  constructor(hooks: IJSONAPIValidatorOptions) {
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

    this.disallowMetaOnlyDocuments = hooks.disallowMetaOnlyDocuments || function() { return true };
    this.disallowMetaOnlyRelationships = hooks.disallowMetaOnlyRelationships || function() { return true };

    /*
      Ember Data  strictly requires singularized, dasherized types
     */
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
  validateDocument(document: Document) {
    let issues = _validateDocument({ validator: this, document });

    coalesceAndThrowErrors(issues);
  }
}
