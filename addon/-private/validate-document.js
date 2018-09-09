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
// import itHasValidLinks from './document-rules/it-has-valid-links';
// import itHasValidErrors from './document-rules/it-has-valid-errors';

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
}) {
  issues = issues || {
    errors: [],
    warnings: [],
  };

  let validationContext = {
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

    // TODO validate links
    // itHasValidLinks(validationContext);
    // TODO validate errors
    // itHasValidErrors(validationContext);
  }

  return issues;
}
