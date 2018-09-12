import itExists from './document-rules/it-exists';
import itHasAtLeastOne from './document-rules/it-has-at-least-one';
import itHasAtLeastOneNonNull from './document-rules/it-has-at-least-one-non-null';
import itCantHaveBoth from './document-rules/it-cant-have-both';
import itHasNoUnknownMembers from './document-rules/it-has-no-unknown-members';
import includedMustHaveData from './document-rules/included-must-have-data';
import validateJsonapiMember from './validate-jsonapi-member';
import validateMeta from './validate-meta';
import dataIsValid from './document-rules/data-is-valid';
import includedIsValid from './document-rules/included-is-valid';
import validateLinks from './validate-links';
// import itHasValidErrors from './document-rules/it-has-valid-errors';

import JSONAPIValidator from '@ember-data/json-api-validator/-private/validator';
import { Document } from 'jsonapi-typescript';
import { IValidationContext } from 'ember-data';


interface IValidateDocument {
  validator: JSONAPIValidator;
  document: Document;
  issues?: unknown;
  path?: string;
}

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
export default function _validateDocument({
  validator,
  document,
  issues,
  path = '<document>',
}: IValidateDocument) {
  issues = issues || {
    errors: [],
    warnings: [],
  };

  let validationContext: IValidationContext = {
    validator,
    document,
    target: document,
    issues,
    path,
  };

  if (itExists(validationContext)) {
    itHasAtLeastOne(validationContext);
    itHasAtLeastOneNonNull(validationContext);
    itCantHaveBoth(validationContext);
    itHasNoUnknownMembers(validationContext);
    includedMustHaveData(validationContext);
    validateJsonapiMember(validationContext);
    validateMeta(validationContext);
    dataIsValid(validationContext);
    includedIsValid(validationContext);
    validateLinks(validationContext);

    // TODO validate errors
    // itHasValidErrors(validationContext);
  }

  return issues;
}
