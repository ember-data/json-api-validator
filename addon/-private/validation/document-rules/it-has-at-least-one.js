import { DocumentError, DOCUMENT_ERROR_TYPES } from '../errors/document-error';
import memberDefined from '../../utils/member-defined';

const AT_LEAST_ONE = ['data', 'meta', 'errors'];

/**
 * Validates that a document has at least one of
 * the following keys: `data`, `meta`, and `errors`.
 *
 * @param validator
 * @param document
 * @param issues
 * @param path
 */
export default function itHasAtLeastOne({ validator, document, issues, path }) {
  let { errors } = issues;

  for (let i = 0; i < AT_LEAST_ONE.length; i++) {
    let neededKey = AT_LEAST_ONE[i];

    if (memberDefined(document, neededKey)) {
      return true;
    }
  }

  errors.push(
    new DocumentError({
      document,
      path,
      code: DOCUMENT_ERROR_TYPES.MISSING_MANDATORY_MEMBER,
      validator,
      value: AT_LEAST_ONE,
    })
  );

  return false;
}
