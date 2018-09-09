import { MetaError, META_ERROR_TYPES } from '../errors/meta-error';
import memberPresent from '../utils/member-present';
import memberDefinedAndNotNull from '../utils/member-defined-and-not-null';

/**
 * Validates that a document has data or errors in addition to meta
 *
 * @param validator
 * @param document
 * @param target
 * @param requiredSiblings
 * @param issues
 * @param path
 * @returns {boolean}
 */
export default function itHasRequiredSibling({
  validator,
  document,
  target,
  requiredSiblings,
  issues,
  path,
}) {
  let { errors } = issues;

  if (!memberPresent(target, 'meta')) {
    return true;
  }

  for (let i = 0; i < requiredSiblings.length; i++) {
    if (memberDefinedAndNotNull(target, requiredSiblings[i])) {
      return true;
    }
  }

  let error = new MetaError({
    document,
    path,
    target,
    member: 'meta',
    code: META_ERROR_TYPES.DISALLOWED_SOLITARY_META_MEMBER,
    validator,
    value: target.meta,
    expectedValue: requiredSiblings
  });

  errors.push(error);

  return false;
}
