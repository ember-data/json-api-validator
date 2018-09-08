import { DocumentError, DOCUMENT_ERROR_TYPES} from './errors/document-error';
import memberPresent from '../utils/member-present';
import isPlainObject from '../utils/is-plain-object';

/**
 * @param validator
 * @param document
 * @param errors
 * @param path
 * @returns {boolean}
 */
export default function validateObjectMeta({ validator, document, issues, path }) {
  let { errors } = issues;

  if (memberPresent(document, 'meta')) {
    if (!isPlainObject(document.meta)) {
      errors.push(new DocumentError({
        code: DOCUMENT_ERROR_TYPES.VALUE_MUST_BE_OBJECT,
        value: document.meta,
        member: 'meta',
        validator,
        document,
        path
      }));
      return false;
    }
  }

  return true;
}
