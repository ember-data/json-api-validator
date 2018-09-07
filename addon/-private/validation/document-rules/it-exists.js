import { DocumentError, DOCUMENT_ERROR_TYPES } from '../errors/document-error';

/**
 * Validates that a document is an object
 *
 * @param validator
 * @param document
 * @param issues
 * @param path
 */
export default function documentExists({ validator, document, issues, path }) {
  let { errors } = issues;
  let type = typeof document;

  if (type !== 'object' || document === null || document instanceof Date) {
    errors.push(
      new DocumentError({
        document,
        path,
        code: DOCUMENT_ERROR_TYPES.INVALID_DOCUMENT,
        validator,
        value: type,
      })
    );

    return false;
  }

  return true;
}
