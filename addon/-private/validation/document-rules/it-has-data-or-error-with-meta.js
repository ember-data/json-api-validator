import { DocumentError, DOCUMENT_ERROR_TYPES } from '../errors/document-error';
import memberPresent from '../../utils/member-present';
import memberDefinedAndNotNull from '../../utils/member-defined-and-not-null';

/**
 * Validates that a document has data or errors in addition to meta
 *
 * @param validator
 * @param document
 * @param issues
 * @param path
 */
export default function itHasDataOrErrorsWithMeta({
  validator,
  document,
  issues,
  path,
}) {
  let { errors } = issues;
  let msg = validator.disallowOnlyMetaDocument();

  if (msg === false) {
    return true;
  }

  if (!memberPresent(document, 'meta')) {
    return true;
  }

  if (
    memberDefinedAndNotNull(document, 'data') ||
    memberDefinedAndNotNull(document, 'errors')
  ) {
    return true;
  }

  let error = new DocumentError({
    document,
    path,
    code: DOCUMENT_ERROR_TYPES.DISALLOWED_SOLITARY_META_MEMBER,
    validator,
    value: msg,
  });

  errors.push(error);

  return false;
}
